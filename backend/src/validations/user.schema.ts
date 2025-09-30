import { z } from 'zod';

export const userSchema = z.object({
    nombre: z.string().min(2).max(100).trim(),
    email: z.string().email().max(150).toLowerCase().trim(),
    password: z.string().min(6).max(255),
    telefono: z.string().max(20).optional().or(z.literal('')),
})