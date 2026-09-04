import { useQuery } from '@tanstack/react-query'
import { listBoardLabels } from '../api/labels.api'

export function useBoardLabels(boardId: string | undefined) {
  return useQuery({
    queryKey: ['labels', boardId],
    queryFn: () => listBoardLabels(boardId as string),
    enabled: !!boardId,
  })
}
