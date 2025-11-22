import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware'; 

const OrderRouter = Router();
const orderController = new OrderController();

OrderRouter.use(AuthMiddleware.authenticate);

OrderRouter.get('/admin', AuthMiddleware.authorizeRoles('admin'), orderController.getAllOrders);
OrderRouter.patch('/admin/:id', AuthMiddleware.authorizeRoles('admin'), orderController.updateStatus);

OrderRouter.post('/', orderController.createOrder);
OrderRouter.get('/', orderController.getOrdersByUser);
OrderRouter.get('/:id', orderController.getOrderById); 

export default OrderRouter;