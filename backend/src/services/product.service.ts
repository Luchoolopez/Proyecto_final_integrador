import { Op, Sequelize } from 'sequelize';
import {
  Product,
  ProductVariant,
  ProductImage,
  includeVariants,
  includeImages,
  includeCategory,
  ProductType,
  ProductVariantType,
} from '../models';

interface ProductFilters {
  categoria_id?: number;
  genero?: 'Hombre' | 'Mujer' | 'Unisex';
  precio_min?: number;
  precio_max?: number;
  talles?: string[];
  busqueda?: string;
  es_nuevo?: boolean;
  es_destacado?: boolean;
  con_descuento?: boolean;
  activo?: boolean;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
}

class ProductService {
  /**
   * Helper: convierte un producto Sequelize a objeto listo para API
   */
  private mapProductData(producto: ProductType) {
    const productoJSON: any = producto.toJSON();
    const variantes: ProductVariantType[] = productoJSON.variantes || [];
    const imagenes: ProductImage[] = productoJSON.imagenes || [];

    return {
      ...productoJSON,
      precio_final: producto.getPrecioFinal ? producto.getPrecioFinal() : producto.precio_base,
      stock_total: variantes.reduce((sum, v) => sum + (v.stock || 0), 0),
      tiene_stock: variantes.some(v => v.stock > 0),
      cantidad_variantes: variantes.length,
      imagenes,
    };
  }

  /**
   * Obtener productos con filtros, paginación y asociaciones
   */
  async getProducts(filters: ProductFilters = {}, pagination: PaginationOptions = {}) {
    const {
      categoria_id,
      genero,
      precio_min,
      precio_max,
      talles,
      busqueda,
      es_nuevo,
      es_destacado,
      con_descuento,
      activo = true,
    } = filters;

    const {
      page = 1,
      limit = 20,
      orderBy = 'fecha_creacion',
      orderDir = 'DESC',
    } = pagination;

    const offset = (page - 1) * limit;

    const where: any = { activo };

    if (con_descuento) where.descuento = { [Op.gt]: 0 };
    if (categoria_id) where.categoria_id = categoria_id;
    if (genero) where.genero = genero;
    if (es_nuevo !== undefined) where.es_nuevo = es_nuevo;
    if (es_destacado !== undefined) where.es_destacado = es_destacado;

    if (busqueda) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } },
        { sku: { [Op.like]: `%${busqueda}%` } },
      ];
    }
    
    const precioFinalSQL = Sequelize.literal('precio_base * (1 - descuento / 100)');

    if (precio_min || precio_max) {
      const precioConditions: any = {};
      if (precio_min) precioConditions[Op.gte] = precio_min;
      if (precio_max) precioConditions[Op.lte] = precio_max;
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.where(precioFinalSQL, precioConditions)
      ];
    }

    const include: any[] = [
      includeVariants,
      includeImages,
      includeCategory,
    ];

    if (talles && talles.length > 0) {
      include[0] = {
        ...includeVariants,
        where: { talle: { [Op.in]: talles }, activo: true, stock: { [Op.gt]: 0 } },
        required: true,
      };
    }

    let order: any = [[orderBy, orderDir]];
    if (orderBy === 'precio_base') {
      order = [[precioFinalSQL, orderDir]];
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order,
      distinct: true,
    });

    const productos = rows.map(p => this.mapProductData(p));

    return {
      productos,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Obtener un producto por ID
   */
  async getProductById(id: number) {
    const producto = await Product.findByPk(id, {
      include: [includeVariants, includeImages, includeCategory],
    });

    if (!producto) throw new Error('Producto no encontrado');
    return this.mapProductData(producto);
  }

  /**
   * Obtener productos destacados
   */
  async getFeaturedProducts(limit: number = 10) {
    const productos = await Product.findAll({
      where: { es_destacado: true, activo: true },
      include: [includeVariants, includeImages],
      limit,
      order: [['fecha_actualizacion', 'DESC']],
    });
    return productos.map(p => this.mapProductData(p));
  }

  /**
   * Obtener productos nuevos
   */
  async getNewProducts(limit: number = 10) {
    const productos = await Product.findAll({
      where: { es_nuevo: true, activo: true },
      include: [includeVariants, includeImages],
      limit,
      order: [['fecha_creacion', 'DESC']],
    });
    return productos.map(p => this.mapProductData(p));
  }

  /**
   * Crear producto con variantes e imágenes
   */
  async createProduct(data: {
    producto: any;
    variantes?: Array<{ talle: string; stock: number; sku_variante?: string }>;
    imagenes?: string[];
  }) {
    const { producto: productoData, variantes = [], imagenes = [] } = data;

    const producto = await Product.create(productoData);

    if (variantes.length > 0) {
      await Promise.all(
        variantes.map(v =>
          ProductVariant.create({ productoId: producto.id, ...v })
        )
      );
    }

    if (imagenes.length > 0) {
      await Promise.all(
        imagenes.map(url =>
          ProductImage.create({
            producto_id: producto.id,
            imagen: url,
          })
        )
      );
    }

    return this.getProductById(producto.id);
  }

  /**
   * Actualizar producto
   */
  async updateProduct(id: number, data: Partial<any>) {
    const producto = await Product.findByPk(id);
    if (!producto) throw new Error('Producto no encontrado');

    await producto.update(data);
    return this.getProductById(id);
  }

  /**
   * Eliminar (desactivar) producto
   */
  async deleteProduct(id: number) {
    const producto = await Product.findByPk(id);
    if (!producto) throw new Error('Producto no encontrado');

    await producto.update({ activo: false });
    await ProductVariant.update({ activo: false }, { where: { productoId: id } });
    return { message: 'Producto desactivado correctamente' };
  }

  /**
   * Verificar disponibilidad de una variante
   */
  async checkVariantAvailability(varianteId: number, cantidad: number = 1) {
    const variante = await ProductVariant.findByPk(varianteId, {
      include: [{ model: Product, as: 'producto', where: { activo: true } }],
    });

    if (!variante) return { disponible: false, mensaje: 'Variante no encontrada' };
    if (!variante.activo) return { disponible: false, mensaje: 'Variante no disponible' };
    if (variante.stock < cantidad) {
      return {
        disponible: false,
        mensaje: `Stock insuficiente (disponible: ${variante.stock})`,
        stock_disponible: variante.stock,
      };
    }

    return {
      disponible: true,
      mensaje: 'Variante disponible',
      stock_disponible: variante.stock,
    };
  }
}

export const productService = new ProductService();
export default productService;
