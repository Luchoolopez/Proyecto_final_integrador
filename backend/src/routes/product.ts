import { Router } from "express";
import { productController } from '../controllers/product.controller';
import { productVariantController } from '../controllers/product-variant.controller';
import { productImageController } from '../controllers/product-image.controller';
import { AuthMiddleware } from "../middlewares/auth.middleware";

const productRouter = Router();

// Rutas publicas de Productos
productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.getById);

// Rutas publicas de Variantes
productRouter.get('/variants/:productoId', productVariantController.getByProduct);

// Rutas protegidas
productRouter.use(AuthMiddleware.authenticate);
// Aplicar middleware de autorización (solo admin) a las rutas que modifican datos
productRouter.use(AuthMiddleware.authorizeRoles('admin'));

// Rutas protegidas de Productos
productRouter.post('/', productController.create);
productRouter.put('/:id', productController.update);
productRouter.delete('/:id', productController.delete);

// Rutas protegidas de Variantes
productRouter.post('/variants', productVariantController.create);
productRouter.put('/variants/:id', productVariantController.update);
productRouter.patch('/variants/:id/stock', productVariantController.updateStock);
// productRouter.delete('/variants/:id', productVariantController.delete);

// Rutas protegidas de Imagenes
productRouter.get('/images/:productoId', productImageController.getByProduct);
productRouter.post('/images', productImageController.create);
productRouter.put('/images/:id', productImageController.update);
productRouter.delete('/images/:id', productImageController.delete);

export default productRouter;
export { productRouter as Router };

