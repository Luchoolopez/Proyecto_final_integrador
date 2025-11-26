import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const subscriptionRouter = Router();

subscriptionRouter.post('/subscribe', SubscriptionController.subscribe);
subscriptionRouter.post('/unsubscribe', SubscriptionController.unsubscribe);


subscriptionRouter.post(
    '/send',
    AuthMiddleware.authenticate,            
    AuthMiddleware.authorizeRoles('admin'),
    SubscriptionController.sendNewsletter
);

export default subscriptionRouter;
export { subscriptionRouter as Router };