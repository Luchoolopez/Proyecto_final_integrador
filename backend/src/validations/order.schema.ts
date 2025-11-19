import { z } from 'zod';

export const createOrderSchema = z.object({
  usuario_id: z.number().int().positive('Usuario ID debe ser un número positivo'),
  estado: z.enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']).default('pendiente'),
  total: z.number().positive('El total debe ser mayor a 0'),
  fecha_pedido: z.date().optional(),
  fecha_entrega: z.date().optional(),
});

export const updateOrderSchema = createOrderSchema.partial();

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
export type UpdateOrderRequest = z.infer<typeof updateOrderSchema>;