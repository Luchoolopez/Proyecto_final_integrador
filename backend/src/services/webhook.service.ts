// services/webhook.service.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { MpConectado } from '../models/MpConectado';
import { User } from '../models/user.model';
import { orderService } from './order.service';

export class WebhookService {
  static async handleNotification(paymentId: string) {
    try {

      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) return;

      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);

      // Consultamos el estado real del pago a la API de MP
      const paymentData = await payment.get({ id: paymentId });

      // Si el pago está aprobado, actualizamos el pedido
      if (paymentData.status === 'approved') {
        const orderId = Number(paymentData.external_reference);

        /*
                const pedidoAnterior = await orderService.getOrderById(orderId);
                if (pedidoAnterior.estado === 'confirmado') {
                  console.log(`⚠️ El pedido ${orderId} ya estaba confirmado. Omitiendo webhook duplicado.`);
                  return;
                }
                */

        // 2. Registrar la transacción en tu tabla `pagos`
        // Asegurate de importar tu modelo Pago y descomentar esto:
        /*
        await Pago.create({
          pedido_id: orderId,
          metodo: 'mercadopago',
          estado: 'aprobado',
          transaccion_id: paymentId,
          monto: paymentData.transaction_amount,
          detalle_metodo: paymentData.payment_method_id, // ej: 'visa', 'account_money'
          cuotas: paymentData.installments,
          fecha_aprobacion: paymentData.date_approved
        });
        */

        // Usamos tu método existente que ya maneja transacciones
        await orderService.updateOrderStatus(orderId, {
          estado: 'confirmado'
        });

        console.log(`✅ Pedido ${orderId} confirmado por pago ${paymentId}`);
      }
    } catch (error) {
      console.error("Error procesando notificación de MP:", error);
    }
  }
}