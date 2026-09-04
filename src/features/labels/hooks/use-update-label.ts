import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { updateLabel } from '../api/labels.api'

export function useUpdateLabel(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels', boardId] })
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
