import { useQuery } from '@tanstack/react-query'
import { listBoards } from '../api/boards.api'
import type { BoardStatus } from '../types'

export function useBoards(
  status: BoardStatus,
  /** El command palette lo consulta sólo mientras está abierto (T11.3). */
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['boards', status],
    queryFn: () => listBoards(status),
    enabled: options?.enabled ?? true,
  })
}
