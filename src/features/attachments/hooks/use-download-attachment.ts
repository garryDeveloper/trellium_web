import { useMutation } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { downloadAttachment } from '../api/attachments.api'

export function useDownloadAttachment() {
  return useMutation({
    mutationFn: downloadAttachment,
    onError: (error) => {
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
  })
}
