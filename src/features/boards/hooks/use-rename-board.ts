import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { renameBoard } from '../api/boards.api'

export function useRenameBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: renameBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      notifications.show({ message: 'Nombre del tablero actualizado', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
