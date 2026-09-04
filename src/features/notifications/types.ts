export type NotificationType =
  | 'card_assigned'
  | 'card_commented'
  | 'board_invited'

/**
 * `deleted`: el tablero o la tarjeta se eliminaron.
 * `no_access`: existen, pero el usuario ya no es miembro del tablero.
 */
export type NotificationAvailability = 'available' | 'deleted' | 'no_access'

export interface AppNotification {
  id: string
  type: NotificationType
  actorName: string
  /** `null` si el tablero fue eliminado. */
  boardId: string | null
  /** Nombre al momento de generarse; sobrevive al borrado. */
  boardName: string
  cardId: string | null
  cardTitle: string | null
  availability: NotificationAvailability
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface NotificationsInbox {
  notifications: AppNotification[]
  unreadCount: number
}
