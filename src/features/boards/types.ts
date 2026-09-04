import type { DueDateStatus } from '@/features/cards/utils/due-date'

export type BoardStatus = 'active' | 'archived'

export interface Board {
  id: string
  name: string
  ownerId: string
  status: BoardStatus
  createdAt: string
}

export interface BoardListItem extends Board {
  role: 'owner' | 'member'
  memberCount: number
}

export interface CreateBoardPayload {
  name: string
}

export interface RenameBoardPayload {
  boardId: string
  name: string
}

export interface TransferOwnershipPayload {
  boardId: string
  newOwnerId: string
}

export interface BoardMember {
  userId: string
  name: string
  email: string
  role: 'owner' | 'member'
}

export interface InviteMemberPayload {
  boardId: string
  email: string
}

export interface BoardInvitation {
  id: string
  boardId: string
  invitedEmail: string
  invitedByUserId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

/**
 * Valor centinela de `member` y `label` en la URL: tarjetas sin miembro
 * asignado / sin etiqueta. Un UUID nunca colisiona con el literal, así que no
 * hace falta un parámetro aparte y "sin etiqueta" participa del OR de su
 * categoría como una opción más.
 */
export const FILTER_NONE = 'none'

/**
 * Filtro de tablero (T11.1). Se aplica en el cliente sobre las tarjetas que ya
 * están en cache: ningún endpoint recibe estos valores.
 *
 * Vacío en las cuatro categorías = sin filtrar. La combinación es OR dentro de
 * cada categoría y AND entre categorías distintas.
 */
export interface BoardFilter {
  /** Ids de usuario, más `FILTER_NONE` para "sin miembro asignado". */
  memberIds: string[]
  /** Ids de etiqueta, más `FILTER_NONE` para "sin etiqueta". */
  labelIds: string[]
  /** Estados de vencimiento derivados, tal como los define `getDueDateStatus`. */
  due: DueDateStatus[]
  /** Texto libre sobre título y descripción. */
  text: string
}
