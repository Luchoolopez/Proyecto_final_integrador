import express from 'express';
import { productController } from '../controllers/product.controller';
import { productVariantController } from '../controllers/product-variant.controller';
import { productImageController } from '../controllers/product-image.controller';

const router = express.Router();

// Productos
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

// Variantes
router.get('/variants/product/:producto_id', productVariantController.getByProduct);
router.post('/variants', productVariantController.create);
router.put('/variants/:id', productVariantController.update);
router.patch('/variants/:id/stock', productVariantController.updateStock);
router.delete('/variants/:id', productVariantController.delete);

// Imagenes
router.get('/images/product/:producto_id', productImageController.getByProduct);
router.post('/images', productImageController.create);
router.put('/images/:id', productImageController.update);
router.delete('/images/:id', productImageController.delete);

export default router;
