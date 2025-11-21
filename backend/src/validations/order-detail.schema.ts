import { z } from 'zod';

export const createOrderDetailSchema = z.object({
  pedido_id: z.number().int().positive('Pedido ID debe ser un número positivo'),
  producto_id: z.number().int().positive('Producto ID debe ser un número positivo'),
  cantidad: z.number().int().positive('La cantidad debe ser mayor a 0'),
  precio_unitario: z.number().positive('El precio unitario debe ser mayor a 0'),
  subtotal: z.number().positive('El subtotal debe ser mayor a 0'),
});

export const updateOrderDetailSchema = createOrderDetailSchema.partial();

export type CreateOrderDetailRequest = z.infer<typeof createOrderDetailSchema>;
export type UpdateOrderDetailRequest = z.infer<typeof updateOrderDetailSchema>;