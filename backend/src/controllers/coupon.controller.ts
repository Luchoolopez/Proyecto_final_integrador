import { Request, Response } from "express";
import { Coupon } from "../models";

export class CouponController {
    
    getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupons = await Coupon.findAll();
            return res.status(200).json({ success: true, data: coupons });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const newCoupon = await Coupon.create(req.body);
            return res.status(201).json({ success: true, data: newCoupon });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const coupon = await Coupon.findByPk(id);
            if (!coupon) return res.status(404).json({ success: false, message: 'Cupón no encontrado' });

            await coupon.update(req.body);
            return res.status(200).json({ success: true, data: coupon });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const coupon = await Coupon.findByPk(id);
            if (!coupon) return res.status(404).json({ success: false, message: 'Cupón no encontrado' });

            await coupon.destroy();
            return res.status(200).json({ success: true, message: 'Cupón eliminado' });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}
