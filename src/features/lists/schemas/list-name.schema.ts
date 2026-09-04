import { z } from 'zod'

export const listNameSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá un nombre para la lista'),
})

export type ListNameFormValues = z.infer<typeof listNameSchema>
