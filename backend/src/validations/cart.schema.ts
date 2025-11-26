import { z } from "zod";

export const createCartItemSchema = z.object({
    variante_id: z.number()
        .int()
        .positive()
        .refine(val => val > 0, {
            message: 'El ID de la variante no es valido',
        }),

    cantidad: z.number()
        .int()
        .min(1, { message: 'La cantidad debe ser al menos 1' })
        .optional()
});

export const updateCartItemSchema = z.object({
    cantidad: z.number()
        .int()
        .min(1, { message: 'La cantidad debe ser al menos 1 ( 0 en caso de querer eliminar)' })
});

export const cartItemParamsSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, { message: 'El ID del item no es válido' }) // Solo dígitos
        .transform(val => parseInt(val, 10)), // Convierte a número
})