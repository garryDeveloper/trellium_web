import { z } from 'zod'

export const cardTitleSchema = z.object({
  title: z.string().trim().min(1, 'Ingresá un título para la tarjeta'),
})

export type CardTitleFormValues = z.infer<typeof cardTitleSchema>
