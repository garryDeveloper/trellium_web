import type { UserSummary } from '@/shared/types/api'
import type { Label } from '@/features/labels/types'

export type CardStatus = 'active' | 'archived'

/** Derivado de los ítems en el backend; `null` si la tarjeta no tiene ítems. */
export interface ChecklistProgress {
  completed: number
  total: number
}

export interface Card {
  id: string
  listId: string
  title: string
  description: string | null
  status: CardStatus
  position: number
  dueDate: string | null
  createdAt: string
  assignees: UserSummary[]
  labels: Label[]
  checklistProgress: ChecklistProgress | null
}

export interface CreateCardPayload {
  listId: string
  title: string
}

export interface UpdateCardPayload {
  cardId: string
  title?: string
  description?: string | null
  dueDate?: string | null
}

export interface ApplyLabelPayload {
  cardId: string
  labelId: string
}

export interface RemoveLabelPayload {
  cardId: string
  labelId: string
}

export interface MoveCardPayload {
  cardId: string
  listId: string
  position: number
}

export interface AssignMemberPayload {
  cardId: string
  userId: string
}

export interface UnassignMemberPayload {
  cardId: string
  userId: string
}
