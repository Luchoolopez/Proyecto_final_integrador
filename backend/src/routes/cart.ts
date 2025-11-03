import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.use(AuthMiddleware.authenticate);

cartRouter.get('/', cartController.getCart);
cartRouter.get('/:id', cartController.getCartItem);
cartRouter.post('/add', cartController.addItem);
cartRouter.put('/:id', cartController.updateItemQuantity);
cartRouter.delete('/:id', cartController.removeItem);
cartRouter.delete('/', cartController.clearCart);

export default cartRouter;