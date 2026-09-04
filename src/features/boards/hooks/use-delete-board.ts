import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '@/shared/api/error'
import { deleteBoard } from '../api/boards.api'

export function useDeleteBoard() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      notifications.show({ message: 'Tablero eliminado definitivamente', color: 'success' })
      navigate('/', { replace: true })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
