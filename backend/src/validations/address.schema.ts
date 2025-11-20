import { z } from "zod";

const addressBaseSchema = z.object({
    calle: z
        .string()
        .min(1, { message: "La calle es obligatoria" })
        .min(3, { message: "La calle debe tener al menos 3 caracteres" })
        .max(150, { message: "La calle no puede superar los 150 caracteres" }),
    
    numero: z
        .string()
        .max(20, { message: "El número no puede superar los 20 caracteres" })
        .optional()
        .nullable(), // Permitimos null si viene del front
    
    piso: z
        .string()
        .max(20, { message: "El piso no puede superar los 20 caracteres" })
        .optional()
        .nullable(),
    
    dpto: z
        .string()
        .max(20, { message: "El departamento no puede superar los 20 caracteres" })
        .optional()
        .nullable(),
    
    ciudad: z
        .string()
        .min(1, { message: "La ciudad es obligatoria" })
        .min(2, { message: "La ciudad debe tener al menos 2 caracteres" })
        .max(100, { message: "La ciudad no puede superar los 100 caracteres" }),
    
    provincia: z
        .string()
        .min(1, { message: "La provincia es obligatoria" })
        .min(2, { message: "La provincia debe tener al menos 2 caracteres" })
        .max(100, { message: "La provincia no puede superar los 100 caracteres" }),
    
    codigo_postal: z
        .string()
        .min(1, { message: "El código postal es obligatorio" })
        .min(3, { message: "El código postal es muy corto" })
        .max(10, { message: "El código postal no puede superar los 10 caracteres" }),
    
    pais: z
        .string()
        .max(100, { message: "El país no puede superar los 100 caracteres" })
        .default("Argentina")
        .optional(),
    
    es_principal: z
        .boolean()
        .default(false)
        .optional(),
});

export const createAddressSchema = addressBaseSchema;

export const updateAddressSchema = addressBaseSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
