import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { renameList } from '../api/lists.api'

export function useRenameList(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: renameList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', boardId] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
