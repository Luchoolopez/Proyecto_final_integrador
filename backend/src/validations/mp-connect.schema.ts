// schemas/mp-connect.schema.ts
import { z } from "zod";

export const mpCallbackSchema = z.object({
    query: z.object({
        code: z.string("El código de autorización es requerido"),
        state: z.string("El ID de usuario (state) es requerido"),
    }),
});

export type MpCallbackQuery = z.infer<typeof mpCallbackSchema>["query"];