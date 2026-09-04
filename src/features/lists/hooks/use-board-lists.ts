import { useQuery } from '@tanstack/react-query'
import { listBoardLists } from '../api/lists.api'
import type { ListStatus } from '../types'

export function useBoardLists(
  boardId: string | undefined,
  status: ListStatus = 'active',
) {
  return useQuery({
    queryKey: ['lists', boardId, status],
    queryFn: () => listBoardLists(boardId as string, status),
    enabled: !!boardId,
  })
}
