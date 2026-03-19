import { Router } from "express";
import { PromotionController } from "../controllers/promotion.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const promotionRouter = Router();
const promotionController = new PromotionController();

// Aquí podrías agregar un middleware adicional para verificar si es admin
promotionRouter.use(AuthMiddleware.authenticate);

promotionRouter.get('/', promotionController.getAll);
promotionRouter.post('/', promotionController.create);
promotionRouter.put('/:id', promotionController.update);
promotionRouter.delete('/:id', promotionController.delete);

export default promotionRouter;
