import { ProductVariant, Product } from '../models';

interface VariantData {
  producto_id: number;
  talle: string;
  sku_variante?: string;
  stock?: number;
  activo?: boolean;
}

class ProductVariantService {
  /**
   * Obtener todas las variantes activas de un producto
   */
  async getVariantsByProduct(productoId: number) {
    const variantes = await ProductVariant.findAll({
      where: { productoId, activo: true },
      order: [['talle', 'ASC']],
    });

    return variantes;
  }

  /**
   * Obtener una variante por ID
   */
  async getVariantById(id: number) {
    const variante = await ProductVariant.findByPk(id, {
      include: [{ model: Product, as: 'producto' }],
    });
    if (!variante) throw new Error('Variante no encontrada');
    return variante;
  }

  /**
   * Crear una nueva variante
   */
  async createVariant(data: VariantData) {
    const { producto_id, talle } = data; 

    if (!producto_id || !talle) { 
      throw new Error('El productoId y talle son obligatorios');
    }

    const variante = await ProductVariant.create({
      productoId: producto_id, 
      talle,
      sku_variante: data.sku_variante, 
      stock: data.stock ?? 0,
      activo: data.activo ?? true,
    });

    return variante;
  }

  /**
   * Actualizar una variante existente
   */
  async updateVariant(id: number, data: Partial<VariantData>) {
    const variante = await ProductVariant.findByPk(id);
    if (!variante) throw new Error('Variante no encontrada');

    await variante.update(data);
    return variante;
  }

  /**
   * Actualizar stock (incrementar o reducir)
   */
  async updateStock(id: number, cantidad: number) {
    const variante = await ProductVariant.findByPk(id);
    if (!variante) throw new Error('Variante no encontrada');

    const nuevoStock = (variante.stock || 0) + cantidad;
    if (nuevoStock < 0) {
      throw new Error('No hay stock suficiente para realizar esta operación');
    }

    variante.stock = nuevoStock;
    await variante.save();

    return variante;
  }

  /**
   * Desactivar una variante
   */
  async deleteVariant(id: number) {
    const variante = await ProductVariant.findByPk(id);
    if (!variante) throw new Error('Variante no encontrada');

    await variante.destroy();
    return { message: 'Variante desactivada correctamente' };
  }
}

export const productVariantService = new ProductVariantService();
export default productVariantService;
