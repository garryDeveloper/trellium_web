import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/shared/api/error'
import { acceptInvitation } from '../api/invitations.api'

export function useAcceptInvitation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (boardId) => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] })
      // La notificación de la invitación cambia de estado al resolverla (T9.3).
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      notifications.show({ message: 'Te uniste al tablero', color: 'success' })
      navigate(`/boards/${boardId}`)
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
