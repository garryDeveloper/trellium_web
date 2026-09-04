import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { unarchiveBoard } from '../api/boards.api'

export function useUnarchiveBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unarchiveBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      notifications.show({ message: 'Tablero restaurado', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
