import { z } from 'zod';

export const createCategorySchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50).trim(),
    descripcion: z.string().max(500).optional().nullable(), // Ajusta el max si es necesario
    activo: z.boolean().optional(), // Es opcional al crear, el servicio pone default true
});

export const updateCategorySchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50).trim().optional(),
    descripcion: z.string().max(500).nullable().optional(),
    activo: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, { // Asegura que al menos un campo se envíe para actualizar
    message: "Debe proporcionar al menos un campo para actualizar",
});