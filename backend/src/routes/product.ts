// import express from 'express';
import { Router } from "express";
import { productController } from '../controllers/product.controller';
import { productVariantController } from '../controllers/product-variant.controller';
import { productImageController } from '../controllers/product-image.controller';

// const router = express.Router();

const productRouter = Router();

// Productos
productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.getById);
productRouter.post('/', productController.create);
productRouter.put('/:id', productController.update);
productRouter.delete('/:id', productController.delete);

// Variantes
productRouter.get('/variants/product/:producto_id', productVariantController.getByProduct);
productRouter.post('/variants', productVariantController.create);
productRouter.put('/variants/:id', productVariantController.update);
productRouter.patch('/variants/:id/stock', productVariantController.updateStock);
productRouter.delete('/variants/:id', productVariantController.delete);

// Imagenes
productRouter.get('/images/product/:producto_id', productImageController.getByProduct);
productRouter.post('/images', productImageController.create);
productRouter.put('/images/:id', productImageController.update);
productRouter.delete('/images/:id', productImageController.delete);

export default productRouter;
export { productRouter as Router };

