import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { productSchema, updateProductSchema } from '../validations/product.validation';

export const productController = {
async getAll(req: Request, res: Response) {
    try {
      // Extraer query params de la url
      const {
        orderBy,
        orderDir,
        page,
        limit,
        categoria_id,
        genero,
        precio_min,
        precio_max,
        talles,
        busqueda,
        es_nuevo,
        es_destacado,
        activo
      } = req.query;

      // Construir el objeto de filtros
      const filters: any = {
        ...(categoria_id && { categoria_id: Number(categoria_id) }),
        ...(genero && { genero: String(genero) }),
        ...(precio_min && { precio_min: Number(precio_min) }),
        ...(precio_max && { precio_max: Number(precio_max) }),
        ...(talles && { talles: Array.isArray(talles) ? talles : [talles] }),
        ...(busqueda && { busqueda: String(busqueda) }),
        ...(es_nuevo !== undefined && { es_nuevo: es_nuevo === 'true' }),
        ...(es_destacado !== undefined && { es_destacado: es_destacado === 'true' }),
        ...(activo !== undefined ? { activo: activo === 'true' } : { activo: true }) 
      };

      // Construir el objeto de paginación
      const pagination: any = {
        ...(orderBy && { orderBy: String(orderBy) }),
        ...(orderDir && { orderDir: String(orderDir) as 'ASC' | 'DESC' }),
        ...(page && { page: Number(page) }),
        ...(limit && { limit: Number(limit) }),
      };
      
      // Pasar objetos al servicio
      const products = await productService.getProducts(filters, pagination);
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.getProductById(id);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsed = productSchema.parse(req.body);
      const product = await productService.createProduct({
        producto: parsed,
        variantes: req.body.variantes,
        imagenes: req.body.imagenes,
      });
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parsed = updateProductSchema.parse(req.body);
      const updated = await productService.updateProduct(id, parsed);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await productService.deleteProduct(id);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
