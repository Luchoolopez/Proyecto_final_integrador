import { z } from "zod";

const subscriptionBaseSchema = z.object({
    email: z
        .string()
        .min(1, { message: "El email es obligatorio" }) 
        .email({ message: "Debes ingresar un formato de email válido" })
        .max(150, { message: "El email no puede superar los 150 caracteres" }),

    activo: z
        .boolean()
        .default(true)
        .optional(),
    
    fecha_baja: z
        .date()
        .nullable()
        .optional(),
});

export const createSubscriptionSchema = subscriptionBaseSchema;

export const updateSubscriptionSchema = subscriptionBaseSchema.partial();

export const sendNewsletterSchema = z.object({
    subject: z
        .string()
        .min(1, { message: "El asunto es obligatorio" }) 
        .min(5, { message: "El asunto debe tener al menos 5 caracteres" })
        .max(100, { message: "El asunto es muy largo (máx 100)" }),
    
    content: z
        .string()
        .min(1, { message: "El mensaje es obligatorio" }) 
        .min(10, { message: "El contenido del mensaje es muy corto" }),
});


export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type SendNewsletterInput = z.infer<typeof sendNewsletterSchema>;