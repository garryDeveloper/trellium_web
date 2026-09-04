import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { archiveCard } from '../api/cards.api'

export function useArchiveCard(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'archived'] })
      notifications.show({ message: 'Tarjeta archivada', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
