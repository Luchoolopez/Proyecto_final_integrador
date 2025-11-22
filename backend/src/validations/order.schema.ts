import { z } from 'zod';

export const createOrderSchema = z.object({
    direccion_id: z.number().int().positive({
        message: 'El ID de dirección debe ser un número positivo'
    }),
    notas: z.string().max(500).optional(),
    shipping_provider: z.string().max(100).optional(),
    shipping_service: z.string().max(100).optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;