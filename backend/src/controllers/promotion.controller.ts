import { Request, Response } from "express";
import { Promotion, Category, Product } from "../models";

export class PromotionController {
    
    getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const promotions = await Promotion.findAll({
                include: [
                    { model: Category, as: 'categorias' },
                    { model: Product, as: 'productos' }
                ]
            });
            return res.status(200).json({ success: true, data: promotions });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { categorias, productos, ...promoData } = req.body;
            const newPromotion = await Promotion.create(promoData);

            if (categorias && categorias.length > 0) {
                await (newPromotion as any).setCategorias(categorias);
            }
            if (productos && productos.length > 0) {
                await (newPromotion as any).setProductos(productos);
            }

            return res.status(201).json({ success: true, data: newPromotion });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const { categorias, productos, ...promoData } = req.body;

            const promotion = await Promotion.findByPk(id);
            if (!promotion) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });

            await promotion.update(promoData);

            if (categorias !== undefined) {
                await (promotion as any).setCategorias(categorias);
            }
            if (productos !== undefined) {
                await (promotion as any).setProductos(productos);
            }

            return res.status(200).json({ success: true, data: promotion });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const promotion = await Promotion.findByPk(id);
            if (!promotion) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });

            await promotion.destroy();
            return res.status(200).json({ success: true, message: 'Promoción eliminada' });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}
