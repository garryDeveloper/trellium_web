import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { rejectInvitation } from '../api/invitations.api'

export function useRejectInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] })
      // La notificación de la invitación cambia de estado al resolverla (T9.3).
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      notifications.show({ message: 'Invitación rechazada', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
