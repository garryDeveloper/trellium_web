import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { inviteMember } from '../api/board-members.api'

export function useInviteMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inviteMember,
    onSuccess: (_data, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: ['board-invitations', boardId] })
      notifications.show({ message: 'Invitación enviada', color: 'success' })
    },
  })
}
