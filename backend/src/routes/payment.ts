import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const paymentController = new PaymentController();

// Ruta para iniciar la compra (Requiere estar logueado)
router.post("/checkout", AuthMiddleware.authenticate, paymentController.createCheckout);
// Ruta para el Webhook 
router.post("/webhook", paymentController.handleWebhook);

export default router;