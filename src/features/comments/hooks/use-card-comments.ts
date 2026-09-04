import { useQuery } from '@tanstack/react-query'
import { listCardComments } from '../api/comments.api'

export function useCardComments(cardId: string | undefined) {
  return useQuery({
    queryKey: ['comments', cardId],
    queryFn: () => listCardComments(cardId as string),
    enabled: !!cardId,
  })
}
