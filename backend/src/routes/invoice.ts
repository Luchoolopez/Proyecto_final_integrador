import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const invoiceRouter = Router();
const invoiceController = new InvoiceController();

invoiceRouter.use(AuthMiddleware.authenticate);

// GET /api/invoice/:orderId
invoiceRouter.get('/:orderId', invoiceController.downloadInvoice);

export default invoiceRouter;
export { invoiceRouter as Router };