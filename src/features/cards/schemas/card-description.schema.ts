import { z } from 'zod'

/**
 * La columna `cards.description` es `text`; el tope es el mismo
 * `@MaxLength(5000)` que valida la API. Se repite acá para avisar mientras se
 * escribe, en vez de perder una descripción larga contra un 400.
 */
export const cardDescriptionSchema = z.object({
  description: z.string().trim().max(5000, 'Máximo 5000 caracteres'),
})

export type CardDescriptionFormValues = z.infer<typeof cardDescriptionSchema>
