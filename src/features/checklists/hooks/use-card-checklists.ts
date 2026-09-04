import { useQuery } from '@tanstack/react-query'
import { listCardChecklists } from '../api/checklists.api'

export function useCardChecklists(cardId: string | undefined) {
  return useQuery({
    queryKey: ['checklists', cardId],
    queryFn: () => listCardChecklists(cardId as string),
    enabled: !!cardId,
  })
}
