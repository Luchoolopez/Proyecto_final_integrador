import { z } from 'zod';

export const manualSaleItemSchema = z.object({
  variante_id: z.number().int().positive({ message: 'ID de variante inválido' }),
  cantidad: z.number().int().positive({ message: 'La cantidad debe ser un número positivo' }),
});

export const createManualSaleSchema = z.object({
  usuario_id: z.number().int().positive({ message: 'ID de usuario inválido' }),
  items: z.array(manualSaleItemSchema).min(1, { message: 'Se debe enviar al menos un item' }),
  notas: z.string().max(500).optional(),
});

export type CreateManualSaleInput = z.infer<typeof createManualSaleSchema>;
