import { useQuery } from '@tanstack/react-query'
import { listBoardMembers } from '../api/board-members.api'

export function useBoardMembers(boardId: string | undefined) {
  return useQuery({
    queryKey: ['board-members', boardId],
    queryFn: () => listBoardMembers(boardId as string),
    enabled: !!boardId,
  })
}
