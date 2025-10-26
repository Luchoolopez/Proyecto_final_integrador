import { z } from 'zod';

export const productVariantSchema = z.object({
  producto_id: z.number(),
  talle: z.string().min(1, 'Debe indicar el talle'),
  sku_variante: z.string().optional(),
  stock: z.number().min(0).optional(),
  activo: z.boolean().optional(),
});

export const updateProductVariantSchema = productVariantSchema.partial();

export const stockUpdateSchema = z.object({
  cantidad: z.number().min(0, 'Cantidad inválida'),
});
