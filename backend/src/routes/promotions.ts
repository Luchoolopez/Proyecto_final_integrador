import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas (o podés dejarlas solo admin, total el carrito lee desde el service)
router.get('/', PromotionController.getAll);

// Rutas protegidas para el Admin
router.post('/', AuthMiddleware.authenticate, AuthMiddleware.authorizeRoles('admin'), PromotionController.create);
router.patch('/:id/status', AuthMiddleware.authenticate, AuthMiddleware.authorizeRoles('admin'), PromotionController.toggleStatus);
router.delete('/:id', AuthMiddleware.authenticate, AuthMiddleware.authorizeRoles('admin'), PromotionController.delete);

export default router;
