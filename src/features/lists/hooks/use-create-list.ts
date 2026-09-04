import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { createList } from '../api/lists.api'

export function useCreateList(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createList({ boardId, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', boardId, 'active'] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
