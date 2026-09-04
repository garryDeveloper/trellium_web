import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { reorderList } from '../api/lists.api'
import type { List, ReorderListPayload } from '../types'

export function useReorderList(boardId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['lists', boardId, 'active']

  return useMutation({
    mutationFn: reorderList,
    onMutate: async ({ listId, position }: ReorderListPayload) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<List[]>(queryKey)

      if (previous) {
        const reordered = [...previous]
        const fromIndex = reordered.findIndex((list) => list.id === listId)
        if (fromIndex !== -1) {
          const [moved] = reordered.splice(fromIndex, 1)
          const toIndex = Math.min(Math.max(position - 1, 0), reordered.length)
          reordered.splice(toIndex, 0, moved)
          queryClient.setQueryData<List[]>(
            queryKey,
            reordered.map((list, index) => ({ ...list, position: index + 1 })),
          )
        }
      }

      return { previous }
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
