import { z } from 'zod'

export const checklistNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Ingresá un nombre para la checklist')
    .max(255, 'Máximo 255 caracteres'),
})

export type ChecklistNameFormValues = z.infer<typeof checklistNameSchema>
