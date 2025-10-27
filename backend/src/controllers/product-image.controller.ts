import { Request, Response } from 'express';
import { productImageService } from '../services/product-image.service';
import {
  productImageSchema,
  updateProductImageSchema,
} from '../validations/product-image.validation';

export const productImageController = {
  async getByProduct(req: Request, res: Response) {
    try {
      const producto_id = Number(req.params.producto_id);
      const images = await productImageService.getImagesByProduct(producto_id);
      res.json(images);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsed = productImageSchema.parse(req.body);
      const image = await productImageService.addImage(parsed);
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parsed = updateProductImageSchema.parse(req.body);
      const updated = await productImageService.updateImage(id, parsed);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await productImageService.deleteImage(id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
