import type { UserSummary } from '@/shared/types/api'

/**
 * Los tipos que esta pantalla sabe describir. El campo `type` de `Activity` es
 * un `string` y no esta unión a propósito: el historial es inmutable y una fila
 * vieja —o una escrita por una versión más nueva del servidor— puede traer un
 * tipo que este cliente no conoce. Se describe genéricamente en vez de romper.
 */
export const KNOWN_ACTIVITY_TYPES = [
  'card_created',
  'card_moved',
  'card_renamed',
  'card_described',
  'card_archived',
  'card_unarchived',
  'assignee_added',
  'assignee_removed',
  'label_applied',
  'label_removed',
  'due_date_set',
  'due_date_cleared',
  'attachment_added',
  'attachment_removed',
] as const

export type KnownActivityType = (typeof KNOWN_ACTIVITY_TYPES)[number]

export interface Activity {
  id: string
  type: string
  boardId: string
  cardId: string | null
  /** `null` si la cuenta de quien lo hizo ya no existe. */
  actor: UserSummary | null
  /** Valores del cambio, ya resueltos al momento de ocurrir. */
  payload: Record<string, unknown>
  createdAt: string
}
