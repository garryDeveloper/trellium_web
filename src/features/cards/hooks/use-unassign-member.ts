import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { cardActivitiesKey } from '@/features/activity/hooks/use-card-activities'
import { unassignMember } from '../api/cards.api'

export function useUnassignMember(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unassignMember,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
      // Esta acción deja un evento en el historial de la tarjeta (T13.1).
      queryClient.invalidateQueries({ queryKey: cardActivitiesKey(variables.cardId) })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
