import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { cardActivitiesKey } from '@/features/activity/hooks/use-card-activities'
import { moveCard } from '../api/cards.api'
import type { Card, MoveCardPayload } from '../types'

interface MoveCardVariables extends MoveCardPayload {
  fromListId: string
}

function reindexed(cards: Card[], listId: string): Card[] {
  return cards.map((card, index) => ({ ...card, listId, position: index + 1 }))
}

export function useMoveCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, listId, position }: MoveCardVariables) =>
      moveCard({ cardId, listId, position }),
    onMutate: async ({ cardId, fromListId, listId, position }) => {
      const fromKey = ['cards', fromListId, 'active']
      const toKey = ['cards', listId, 'active']

      await queryClient.cancelQueries({ queryKey: fromKey })
      if (listId !== fromListId) {
        await queryClient.cancelQueries({ queryKey: toKey })
      }

      const previousFrom = queryClient.getQueryData<Card[]>(fromKey)
      const previousTo =
        listId !== fromListId ? queryClient.getQueryData<Card[]>(toKey) : undefined

      if (!previousFrom) {
        return { previousFrom, previousTo, fromKey, toKey }
      }

      const moved = previousFrom.find((card) => card.id === cardId)
      if (!moved) {
        return { previousFrom, previousTo, fromKey, toKey }
      }

      if (fromListId === listId) {
        const remaining = previousFrom.filter((card) => card.id !== cardId)
        const targetIndex = Math.min(Math.max(position - 1, 0), remaining.length)
        remaining.splice(targetIndex, 0, moved)
        queryClient.setQueryData<Card[]>(fromKey, reindexed(remaining, listId))
      } else {
        const remainingFrom = previousFrom.filter((card) => card.id !== cardId)
        queryClient.setQueryData<Card[]>(
          fromKey,
          reindexed(remainingFrom, fromListId),
        )

        const destination = previousTo ?? []
        const targetIndex = Math.min(Math.max(position - 1, 0), destination.length)
        const nextTo = [...destination]
        nextTo.splice(targetIndex, 0, { ...moved, listId })
        queryClient.setQueryData<Card[]>(toKey, reindexed(nextTo, listId))
      }

      return { previousFrom, previousTo, fromKey, toKey }
    },
    onError: (error, _variables, context) => {
      if (context?.previousFrom) {
        queryClient.setQueryData(context.fromKey, context.previousFrom)
      }
      if (context?.toKey && context.previousTo) {
        queryClient.setQueryData(context.toKey, context.previousTo)
      }
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.fromListId, 'active'] })
      queryClient.invalidateQueries({ queryKey: ['cards', variables.listId, 'active'] })
      // Esta acción deja un evento en el historial de la tarjeta (T13.1).
      queryClient.invalidateQueries({ queryKey: cardActivitiesKey(variables.cardId) })
    },
  })
}
