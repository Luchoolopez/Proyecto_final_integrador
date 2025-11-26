import { z } from 'zod';

export const registerSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).trim(),
    email: z.string().email('Email inválido').max(150).toLowerCase().trim(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(255),
    telefono: z.string().max(20).optional().or(z.literal('')),
});

export const loginSchema = z.object({
    email: z.string().email('Email inválido').toLowerCase().trim(),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token es requerido'),
});