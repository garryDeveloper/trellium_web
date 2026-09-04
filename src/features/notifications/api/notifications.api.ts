import { httpClient } from '@/shared/api/http-client'
import type { AppNotification, NotificationsInbox } from '../types'

export async function listMyNotifications(): Promise<NotificationsInbox> {
  const { data } = await httpClient.get<NotificationsInbox>(
    '/me/notifications',
  )
  return data
}

export async function markNotificationRead(
  notificationId: string,
): Promise<AppNotification> {
  const { data } = await httpClient.patch<AppNotification>(
    `/notifications/${notificationId}/read`,
  )
  return data
}

export async function markAllNotificationsRead(): Promise<number> {
  // Sin body y sin `Content-Type`: Fastify rechaza un body vacío si se declara
  // `application/json`.
  const { data } = await httpClient.post<{ updated: number }>(
    '/me/notifications/read-all',
  )
  return data.updated
}
