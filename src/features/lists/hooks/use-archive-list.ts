import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { archiveList } from '../api/lists.api'

export function useArchiveList(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', boardId] })
      notifications.show({ message: 'Lista archivada', color: 'success' })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
