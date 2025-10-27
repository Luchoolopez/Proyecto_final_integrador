import { z } from 'zod';

export const productSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  precio_base: z.number().positive('Debe ser un número positivo'),
  descuento: z.number().min(0).max(100).optional(),
  categoria_id: z.number().optional(),
  genero: z.enum(['Hombre', 'Mujer', 'Unisex']).optional(),
  es_nuevo: z.boolean().optional(),
  es_destacado: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();
