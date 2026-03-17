import { MercadoPagoConfig, Preference } from 'mercadopago';
import { MpConectado } from '../models/MpConectado';
import { orderService } from './order.service';

export class PaymentService {
  static async createPreference(pedidoId: number, usuarioId: number) {
    const pedido = await orderService.getOrderById(pedidoId, usuarioId);

    // En tu ecommerce de ropa, asumimos que hay un admin principal (ID 1 o el que definas)
    const mpConfig = await MpConectado.findOne({ where: { usuario_id: 1 } }); 
    if (!mpConfig) throw new Error("La tienda no tiene Mercado Pago vinculado");

    // Configuramos MP con el token del vendedor
    const client = new MercadoPagoConfig({ accessToken: mpConfig.access_token });
    const preference = new Preference(client);

    // Arma los items para MP desde los detalles del pedido
    const items = (pedido as any).detalles.map((det: any) => ({
      id: String(det.variante_id),
      title: det.nombre_producto,
      quantity: det.cantidad,
      unit_price: Number(det.precio_unitario),
      currency_id: 'ARS'
    }));

    // Creamos la preferencia
    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago-exitoso`,
          failure: `${process.env.FRONTEND_URL}/pago-fallido`,
          pending: `${process.env.FRONTEND_URL}/pago-pendiente`,
        },
        auto_return: "approved",
        notification_url: process.env.MP_NOTIFICATION_URL, // Tu webhook
        external_reference: String(pedido.id), // ID del pedido para el Webhook
      }
    });

    return {
      id: result.id,
      init_point: result.init_point
    };
  }
}