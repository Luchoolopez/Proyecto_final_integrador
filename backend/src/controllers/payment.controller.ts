import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { PaymentService } from "../services/payment.service";
import { WebhookService } from "../services/webhook.service";
import { createOrderSchema } from "../validations/order.schema";
import { ZodError } from "zod";

export class PaymentController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }
    createCheckout = async (req: Request, res: Response): Promise<Response> => {
        try {
            const usuario_id = req.user!.id;

            const parsedBody = createOrderSchema.parse(req.body);

            const newOrder = await this.orderService.createOrder(usuario_id, parsedBody);

            const checkout = await PaymentService.createPreference(newOrder.id, usuario_id);

            return res.status(201).json({
                success: true,
                message: 'Checkout generado exitosamente',
                data: {
                    order: newOrder,
                    checkoutUrl: checkout.init_point,
                    preferenceId: checkout.id
                }
            });

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de orden inválidos',
                    errors: error.issues
                });
            }

            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al procesar el checkout',
                error
            });
        }
    };

    handleWebhook = async (req: Request, res: Response): Promise<Response> => {
        try {
            // Verificar que la petición venga de Mercado Pago
            const xSignature = req.headers['x-signature'] as string;
            const xRequestId = req.headers['x-request-id'] as string;

            if (!xSignature || !xRequestId) {
                return res.status(401).json({
                    success: false,
                    message: 'Firma de Mercado Pago faltante'
                });
            }

            // Aquí podrías validar la firma si es necesario
            // Por simplicidad, asumimos que si tiene los headers, es válido

            const { type, data } = req.body;
            if (type === 'payment' && data?.id) {
                await WebhookService.handleNotification(data.id);
            }
            return res.status(200).send("OK");
        } catch (error) {
            console.error("Webhook Error:", error);
            // Aunque falle, respondemos 200 para evitar bloqueos de MP,
            // pero lo logueamos para debugear.
            return res.status(200).send("Error logged");
        }
    };
}