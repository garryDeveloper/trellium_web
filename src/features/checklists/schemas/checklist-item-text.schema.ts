import { z } from 'zod'

export const checklistItemTextSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Escribí el ítem')
    .max(500, 'Máximo 500 caracteres'),
})

export type ChecklistItemTextFormValues = z.infer<
  typeof checklistItemTextSchema
>
