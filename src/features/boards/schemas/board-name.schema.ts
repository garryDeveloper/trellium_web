import { z } from 'zod'

export const boardNameSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá un nombre para el tablero'),
})

export type BoardNameFormValues = z.infer<typeof boardNameSchema>
