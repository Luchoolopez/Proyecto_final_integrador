import { z } from 'zod';
import { SHIPPING_PROVIDER_VALUES } from '../utils/order/order.constants';

export const createOrderSchema = z.object({
  body: z.object({
    direccion_id: z
      .number({ error: 'La dirección de envío es obligatoria' })
      .int()
      .positive(),
    
    notas: z.string().max(500, 'Las notas no pueden superar los 500 caracteres').optional(),
    
    shipping_provider: z.enum(SHIPPING_PROVIDER_VALUES).optional(),
    shipping_service: z.string().optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];