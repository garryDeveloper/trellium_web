import { useQuery } from '@tanstack/react-query'
import { listCardAttachments } from '../api/attachments.api'

export function useCardAttachments(cardId: string | undefined) {
  return useQuery({
    queryKey: ['attachments', cardId],
    queryFn: () => listCardAttachments(cardId as string),
    enabled: !!cardId,
  })
}
