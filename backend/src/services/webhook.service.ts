// services/webhook.service.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { MpConectado } from '../models/MpConectado';
import { orderService } from './order.service';

export class WebhookService {
  static async handleNotification(paymentId: string) {
    try {
      // se necesita el token del vendedor para consultar este pago
      const mpConfig = await MpConectado.findOne({ where: { usuario_id: 1 } });
      if (!mpConfig) return;

      const client = new MercadoPagoConfig({ accessToken: mpConfig.access_token });
      const payment = new Payment(client);

      // Consultamos el estado real del pago a la API de MP
      const paymentData = await payment.get({ id: paymentId });

      // Si el pago está aprobado, actualizamos el pedido
      if (paymentData.status === 'approved') {
        const orderId = Number(paymentData.external_reference);
        
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