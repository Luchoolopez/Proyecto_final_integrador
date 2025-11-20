import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { createOrderSchema } from "../validations/order.schema";
import { ERROR_MESSAGES } from "../utils/order/order.constants";
import { ZodError } from "zod";

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    createOrder = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;

            const parsedBody = createOrderSchema.parse(req.body);

            const newOrder = await this.orderService.createOrder(
                usuario_id,
                parsedBody.body 
            );

            return res.status(201).json({
                success: true,
                message: 'Pedido creado exitosamente',
                data: newOrder
            });

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: error.issues
                });
            }
            
            let errorMessage = ERROR_MESSAGES.CREATE_ORDER_ERROR;
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return res.status(500).json({
                success: false,
                message: errorMessage,
                error: error
            });
        }
    };

    getOrderById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de pedido inválido'
                });
            }

            const order = await this.orderService.getOrderById(Number(id), usuario_id);

            return res.status(200).json({
                success: true,
                data: order
            });

        } catch (error) {
            let errorMessage = ERROR_MESSAGES.ORDER_NOT_FOUND;
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return res.status(404).json({ 
                success: false,
                message: errorMessage,
                error: error
            });
        }
    };

    getOrdersByUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;
            const orders = await this.orderService.getOrdersByUser(usuario_id);

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.GET_ORDERS_ERROR,
                error: error
            });
        }
    };
}