import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { productSchema, updateProductSchema } from '../validations/product.validation';

export const productController = {
  async getAll(req: Request, res: Response) {
    try {
      const products = await productService.getProducts();
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
