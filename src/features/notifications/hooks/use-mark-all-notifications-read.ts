import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications as toast } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { markAllNotificationsRead } from '../api/notifications.api'
import { NOTIFICATIONS_QUERY_KEY } from './use-notifications'

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
    onError: (error) => {
      toast.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
