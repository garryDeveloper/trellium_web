import { useQuery } from '@tanstack/react-query'
import { listBoardInvitations } from '../api/board-members.api'

export function useBoardInvitations(boardId: string | undefined) {
  return useQuery({
    queryKey: ['board-invitations', boardId],
    queryFn: () => listBoardInvitations(boardId as string),
    enabled: !!boardId,
  })
}
