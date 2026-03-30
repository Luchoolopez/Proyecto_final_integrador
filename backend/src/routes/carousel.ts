import { Router } from 'express';
import { CarouselController } from '../controllers/carousel.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

// Rutas Públicas
// GET /api/carousel -> Devuelve las fotos activas para el inicio
router.get('/', CarouselController.getActive);

// Rutas Privadas (Solo Admin)
router.get(
    '/admin', 
    AuthMiddleware.authenticate, 
    AuthMiddleware.authorizeRoles('admin'), 
    CarouselController.getAllAdmin
);

router.post(
    '/', 
    AuthMiddleware.authenticate, 
    AuthMiddleware.authorizeRoles('admin'), 
    upload.single('imagen'), // Usamos multer para interceptar el archivo
    CarouselController.upload
);

router.delete(
    '/:id', 
    AuthMiddleware.authenticate, 
    AuthMiddleware.authorizeRoles('admin'), 
    CarouselController.delete
);

export default router;