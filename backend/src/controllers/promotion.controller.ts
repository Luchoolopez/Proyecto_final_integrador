import { Request, Response } from 'express';
import { Promotion, Category, Product } from '../models';

export class PromotionController {
    
    static async create(req: Request, res: Response) {
        try {
            const { categoriasIds, productosIds, ...promoData } = req.body;

            // 1. Crear la regla base de la promoción
            const nuevaPromo = await Promotion.create(promoData);

            // 2. MAGIA DE SEQUELIZE: Si mandaron categorías, las vinculamos a la tabla intermedia
            if (categoriasIds && categoriasIds.length > 0) {
                await (nuevaPromo as any).setCategorias(categoriasIds);
            }

            // 3. Si mandaron productos específicos, los vinculamos
            if (productosIds && productosIds.length > 0) {
                await (nuevaPromo as any).setProductos(productosIds);
            }

            return res.status(201).json({ success: true, data: nuevaPromo, message: 'Promoción creada' });
        } catch (error: any) {
            console.error('Error al crear promoción:', error);
            return res.status(500).json({ success: false, message: 'Error al crear la promoción', error: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const promociones = await Promotion.findAll({
                include: [
                    { model: Category, as: 'categorias', attributes: ['id', 'nombre'] },
                    { model: Product, as: 'productos', attributes: ['id', 'nombre'] }
                ]
            });
            return res.json({ success: true, data: promociones });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error al obtener promociones' });
        }
    }

    static async toggleStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const promo = await Promotion.findByPk(id);
            if (!promo) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
            
            await promo.update({ activa: !promo.activa });
            return res.json({ success: true, message: 'Estado de la promoción actualizado' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error al actualizar estado' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await Promotion.destroy({ where: { id } });
            return res.json({ success: true, message: 'Promoción eliminada' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error al eliminar' });
        }
    }
}
