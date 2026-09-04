import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { unarchiveList } from '../api/lists.api'

export function useUnarchiveList(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unarchiveList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', boardId] })
      notifications.show({ message: 'Lista restaurada', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
