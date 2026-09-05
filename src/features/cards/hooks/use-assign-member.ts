import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { cardActivitiesKey } from '@/features/activity/hooks/use-card-activities'
import { assignMember } from '../api/cards.api'

export function useAssignMember(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignMember,
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
