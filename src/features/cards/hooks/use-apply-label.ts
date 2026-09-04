import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { applyLabel } from '../api/cards.api'

export function useApplyLabel(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: applyLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
