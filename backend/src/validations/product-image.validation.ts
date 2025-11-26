import { z } from 'zod';

export const productImageSchema = z.object({
  producto_id: z.number(),
  imagen: z.string().url('Debe ser una URL válida'),
  orden: z.number().optional(),
  es_principal: z.boolean().optional(),
});

export const updateProductImageSchema = productImageSchema.partial();
