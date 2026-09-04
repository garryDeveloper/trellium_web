import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { addChecklistItem } from '../api/checklists.api'

export function useAddChecklistItem(cardId: string, listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', cardId] })
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
