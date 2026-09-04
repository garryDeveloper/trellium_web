import { z } from 'zod'

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresá un email')
    .email('Ingresá un email válido'),
})

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>
