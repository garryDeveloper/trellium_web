import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { cardActivitiesKey } from '@/features/activity/hooks/use-card-activities'
import { unarchiveCard } from '../api/cards.api'

export function useUnarchiveCard(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unarchiveCard,
    onSuccess: (_data, cardId) => {
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'archived'] })
      // Esta acción deja un evento en el historial de la tarjeta (T13.1).
      queryClient.invalidateQueries({ queryKey: cardActivitiesKey(cardId) })
      notifications.show({ message: 'Tarjeta restaurada', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
