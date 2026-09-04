import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { createCard } from '../api/cards.api'

export function useCreateCard(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (title: string) => createCard({ listId, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
