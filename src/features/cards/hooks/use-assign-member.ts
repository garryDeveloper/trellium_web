import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { assignMember } from '../api/cards.api'

export function useAssignMember(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
