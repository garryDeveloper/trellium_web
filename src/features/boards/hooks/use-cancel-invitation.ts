import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { cancelInvitation } from '../api/board-members.api'

export function useCancelInvitation(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: string) => cancelInvitation(boardId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-invitations', boardId] })
      notifications.show({ message: 'Invitación cancelada', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
