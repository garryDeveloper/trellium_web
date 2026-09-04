import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications as toast } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { markNotificationRead } from '../api/notifications.api'
import { NOTIFICATIONS_QUERY_KEY } from './use-notifications'
import type { NotificationsInbox } from '../types'

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationRead,
    // Abrir una notificación navega en el mismo gesto: sin la actualización
    // optimista, el punto de "no leída" quedaría visible hasta que vuelva la
    // respuesta, ya con el usuario en otra pantalla.
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      const previous = queryClient.getQueryData<NotificationsInbox>(
        NOTIFICATIONS_QUERY_KEY,
      )

      queryClient.setQueryData<NotificationsInbox>(
        NOTIFICATIONS_QUERY_KEY,
        (inbox) => {
          if (!inbox) return inbox
          const wasUnread = inbox.notifications.some(
            (item) => item.id === notificationId && !item.isRead,
          )
          return {
            notifications: inbox.notifications.map((item) =>
              item.id === notificationId ? { ...item, isRead: true } : item,
            ),
            unreadCount: Math.max(0, inbox.unreadCount - (wasUnread ? 1 : 0)),
          }
        },
      )

      return { previous }
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous)
      }
      toast.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}
