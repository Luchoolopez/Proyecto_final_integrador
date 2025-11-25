import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { InvoiceService } from '../services/invoice.service';

export class InvoiceController {
    private orderService: OrderService;
    private invoiceService: InvoiceService;

    constructor() {
        this.orderService = new OrderService();
        this.invoiceService = new InvoiceService();
    }

    downloadInvoice = async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.rol;

            // 1. Obtener la orden (Reusamos el servicio existente)
            // Nota: getOrderById valida que la orden pertenezca al usuario
            // Si eres admin, podrías necesitar otra lógica, pero asumamos usuario normal por ahora.
            const order = await this.orderService.getOrderById(Number(orderId), userId);

            // 2. Validar estado (Solo confirmado en adelante)
            const estadosValidos = ['confirmado', 'armando', 'enviado', 'entregado'];
            if (!estadosValidos.includes(order.estado)) {
                return res.status(400).json({ 
                    message: 'La factura solo está disponible para órdenes confirmadas.' 
                });
            }

            // 3. Generar PDF
            await this.invoiceService.generateInvoice(order, res);

        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                 // Si el error es "Order not found", devuelve 404
                if(error.message.includes('no encontrado')) return res.status(404).send('Orden no encontrada');
            }
            res.status(500).send('Error al generar la factura');
        }
    }
}