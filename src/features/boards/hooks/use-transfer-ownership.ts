import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { transferOwnership } from '../api/boards.api'

export function useTransferOwnership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transferOwnership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      notifications.show({ message: 'Propiedad del tablero transferida', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
