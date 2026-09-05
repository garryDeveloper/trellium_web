import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { cardActivitiesKey } from '@/features/activity/hooks/use-card-activities'
import { uploadAttachment } from '../api/attachments.api'

export function useUploadAttachment(cardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', cardId] })
      // Esta acción deja un evento en el historial de la tarjeta (T13.1).
      queryClient.invalidateQueries({ queryKey: cardActivitiesKey(cardId) })
    },
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
