import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { createCartItemSchema, updateCartItemSchema } from "../validations/cart.schema";
import { ERROR_MESSAGES } from "../utils/cart/cart.constants";
import { number, success, ZodError } from "zod";

export class CartController {
    private cartService: CartService;
    constructor() {
        this.cartService = new CartService();
    }

    getCart = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user.id;
            const cartItems = await this.cartService.getCart(usuario_id);
            return res.status(200).json({
                success: true,
                count: cartItems.length,
                data: cartItems
            });
        } catch (error) {
            return res.status(500).json({
                sucess: false,
                message: ERROR_MESSAGES.GET_CART_ERROR,
                error: error
            });
        }
    };

    getCartItem = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ID
                })
            }

            const item = await this.cartService.getCartItem(Number(id), usuario_id);
            return res.status(200).json({
                success: true,
                data: item
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.GET_CART_ITEM_ERROR,
                error: error
            });
        }
    };

    addItem = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user.id;
            const parseBody = createCartItemSchema.parse(req.body);

            const newItem = await this.cartService.addItem(
                usuario_id,
                parseBody.variante_id,
                parseBody.cantidad
            );

            return res.status(201).json({
                success: true,
                message: 'Item agregado al carrito',
                data: newItem
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos invalidos',
                    errors: error
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Error al agregar el item',
                error: error
            })
        }
    };

    updateItemQuantity = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ID
                });
            }

            const parsedBody = updateCartItemSchema.parse(req.body);
            const updatedItem = await this.cartService.updateItemQuantity(
                Number(id),
                parsedBody.cantidad,
                usuario_id
            );
            return res.status(200).json({
                success: true,
                message: 'Cantidad actualizada',
                data: updatedItem
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos invalidos',
                    errors: error
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el item',
                error: error
            })
        }
    };

    clearCart = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user.id;
            await this.cartService.clearCart(usuario_id);
            return res.status(200).json({
                success: true,
                message: 'Carrito vaciado exitosamente'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.CLEAR_CART_ERROR,
                error: error
            })
        }
    }

    removeItem = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ID
                });
            }

            await this.cartService.removeItem(Number(id), usuario_id);

            return res.status(200).json({
                success: true,
                message: 'Item eliminado del carrito'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar item',
                error: error
            });
        }
    };
}