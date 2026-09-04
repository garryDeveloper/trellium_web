import { z } from 'zod'

/**
 * La columna `comments.body` es `text`, así que el tope no lo impone la base:
 * es el mismo `@MaxLength(5000)` que valida la API. Repetirlo acá es para
 * avisar mientras se escribe, en vez de perder el texto contra un 400.
 */
export const commentBodySchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, 'Escribí un comentario')
    .max(5000, 'Máximo 5000 caracteres'),
})

export type CommentBodyFormValues = z.infer<typeof commentBodySchema>
