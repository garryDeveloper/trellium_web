import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { deleteChecklistItem } from '../api/checklists.api'

export function useDeleteChecklistItem(cardId: string, listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', cardId] })
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
