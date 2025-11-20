import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware'; 
const OrderRouter = Router();
const orderController = new OrderController();

OrderRouter.use(AuthMiddleware.authenticate);

OrderRouter.post('/', orderController.createOrder);
OrderRouter.get('/', orderController.getOrdersByUser);
OrderRouter.get('/:id', orderController.getOrderById);

export default OrderRouter;