import { Router } from "express";
import { CouponController } from "../controllers/coupon.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const couponRouter = Router();
const couponController = new CouponController();

// Aquí podrías agregar un middleware adicional para verificar si es admin
couponRouter.use(AuthMiddleware.authenticate);

couponRouter.get('/', couponController.getAll);
couponRouter.post('/', couponController.create);
couponRouter.put('/:id', couponController.update);
couponRouter.delete('/:id', couponController.delete);

export default couponRouter;
