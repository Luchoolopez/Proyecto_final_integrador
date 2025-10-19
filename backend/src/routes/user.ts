import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const userRouter = Router();
const userController = new UserController();

userRouter.use(AuthMiddleware.authenticate);

// Rutas para usuarios
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateUser);
userRouter.put('/:id/password', userController.changePassword);
userRouter.delete('/:id', userController.deleteUser);

// Rutas solo para admin
userRouter.get(
    '/',
    AuthMiddleware.authorizeRoles('admin'),
    userController.getUsers
);

export default userRouter;
export { userRouter as Router };