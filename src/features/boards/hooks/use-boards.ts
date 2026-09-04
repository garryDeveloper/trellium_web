import { useQuery } from '@tanstack/react-query'
import { listBoards } from '../api/boards.api'
import type { BoardStatus } from '../types'

export function useBoards(status: BoardStatus) {
  return useQuery({
    queryKey: ['boards', status],
    queryFn: () => listBoards(status),
  })
}
