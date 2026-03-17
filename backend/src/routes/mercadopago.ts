import { Router } from "express";
import { MercadoPagoController } from "../controllers/mercadopago.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const mpController = new MercadoPagoController();

// Ruta para iniciar la conexión con Mercado Pago (solo admin)
router.get("/connect", AuthMiddleware.authenticate, mpController.connect);

// Ruta para el callback de Mercado Pago (no requiere auth ya que viene de MP)
router.get("/callback", mpController.callback);

// Ruta para verificar el estado de la conexión
router.get("/status", AuthMiddleware.authenticate, mpController.status);

export default router;