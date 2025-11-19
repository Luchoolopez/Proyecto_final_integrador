import { z } from 'zod';

export const createShippingSchema = z.object({
  pedido_id: z.number().int().positive('Pedido ID debe ser un número positivo'),
  proveedor: z.enum(['andreani', 'correo_argentino']).describe('Proveedor debe ser "andreani" o "correo_argentino"'),
  accion: z.string().min(1, 'La acción es requerida').max(50, 'La acción debe tener máximo 50 caracteres'),
  request: z.string().optional(),
  response: z.string().optional(),
  estado: z.enum(['success', 'error', 'warning']).default('success'),
  mensaje: z.string().max(500, 'El mensaje debe tener máximo 500 caracteres').optional(),
  fecha: z.date().optional(),
});

export const updateShippingSchema = createShippingSchema.partial();

export type CreateShippingRequest = z.infer<typeof createShippingSchema>;
export type UpdateShippingRequest = z.infer<typeof updateShippingSchema>;