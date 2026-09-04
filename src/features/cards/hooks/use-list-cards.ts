import { useQuery } from '@tanstack/react-query'
import { listCards } from '../api/cards.api'
import type { CardStatus } from '../types'

export function useListCards(
  listId: string | undefined,
  status: CardStatus = 'active',
) {
  return useQuery({
    queryKey: ['cards', listId, status],
    queryFn: () => listCards(listId as string, status),
    enabled: !!listId,
  })
}
