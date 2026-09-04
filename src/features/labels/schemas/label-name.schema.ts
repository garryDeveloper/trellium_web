import { z } from 'zod'

export const labelNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Ingresá un nombre para la etiqueta')
    .max(50, 'Máximo 50 caracteres'),
})

export type LabelNameFormValues = z.infer<typeof labelNameSchema>
