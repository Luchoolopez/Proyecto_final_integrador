import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const authRouter = Router();
const authController = new AuthController();

// Rutas públicas
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);

// Rutas protegidas
authRouter.post('/logout', AuthMiddleware.authenticate, authController.logout);
authRouter.get('/me', AuthMiddleware.authenticate, authController.me);

export default authRouter;
export { authRouter as Router };