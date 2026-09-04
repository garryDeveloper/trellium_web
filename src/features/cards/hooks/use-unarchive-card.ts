import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { unarchiveCard } from '../api/cards.api'

export function useUnarchiveCard(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unarchiveCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'archived'] })
      notifications.show({ message: 'Tarjeta restaurada', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
