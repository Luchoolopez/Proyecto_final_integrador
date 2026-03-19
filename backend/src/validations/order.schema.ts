import { z } from 'zod';

export const createOrderSchema = z.object({
    // Hacemos que la dirección sea opcional agregando .optional() al final
    direccion_id: z.number().int().positive({
        message: 'El ID de dirección debe ser un número positivo'
    }).optional(),
    notas: z.string().max(500).optional(),
    shipping_provider: z.string().max(100).optional(),
    shipping_service: z.string().max(100).optional(),
    codigo_cupon: z.string().optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;