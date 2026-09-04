import type { AppNotification, NotificationAvailability } from '../types'

/**
 * El texto se arma en el cliente a partir del tipo y de los nombres que la API
 * guardó al generar la notificación, así sigue leyéndose aunque el tablero o la
 * tarjeta ya no existan.
 */
export function getNotificationText(notification: AppNotification): string {
  switch (notification.type) {
    case 'card_assigned':
      return `${notification.actorName} te asignó a "${notification.cardTitle ?? 'una tarjeta'}"`
    case 'card_commented':
      return `${notification.actorName} comentó en "${notification.cardTitle ?? 'una tarjeta'}"`
    case 'board_invited':
      return `${notification.actorName} te invitó a "${notification.boardName}"`
  }
}

/** El aviso que reemplaza al enlace cuando la notificación no lleva a ningún lado. */
export const AVAILABILITY_NOTICE: Record<
  Exclude<NotificationAvailability, 'available'>,
  string
> = {
  deleted: 'Este contenido ya no está disponible.',
  no_access: 'Ya no tenés acceso a este tablero.',
}

/** Adónde navega al abrirla, o `null` si no se puede navegar. */
export function getNotificationLink(
  notification: AppNotification,
): string | null {
  if (notification.availability !== 'available' || !notification.boardId) {
    return null
  }

  return notification.cardId
    ? `/boards/${notification.boardId}?card=${notification.cardId}`
    : `/boards/${notification.boardId}`
}
