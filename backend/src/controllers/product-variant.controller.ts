import { Request, Response } from 'express';
import { productVariantService } from '../services/product-variant.service';
import {
  productVariantSchema,
  updateProductVariantSchema,
  stockUpdateSchema,
} from '../validations/product-variant.validation';

export const productVariantController = {
  async getByProduct(req: Request, res: Response) {
    try {
      const productoId = Number(req.params.productoId);
      const variants = await productVariantService.getVariantsByProduct(productoId);
      res.json(variants);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsed = productVariantSchema.parse(req.body);
      const variant = await productVariantService.createVariant(parsed);
      res.status(201).json(variant);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parsed = updateProductVariantSchema.parse(req.body);
      const updated = await productVariantService.updateVariant(id, parsed);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateStock(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { cantidad } = stockUpdateSchema.parse(req.body);
      const updated = await productVariantService.updateStock(id, cantidad);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await productVariantService.deleteVariant(id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
