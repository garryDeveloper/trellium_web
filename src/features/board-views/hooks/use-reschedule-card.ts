import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { updateCard } from '@/features/cards/api/cards.api'
import type { Card } from '@/features/cards/types'
import { formatDueDate } from '@/features/cards/utils/due-date'

interface RescheduleCardVariables {
  card: Card
  dueDate: string
}

/**
 * Cambiar la fecha límite arrastrando en el calendario (T12.2).
 *
 * No usa `use-update-card` porque ese hook se ata a una lista al construirse y
 * acá la tarjeta arrastrada puede ser de cualquiera de las listas del tablero:
 * la lista sale de la tarjeta, en cada mutación.
 *
 * Es optimista a propósito: el arrastre ya movió la tarjeta bajo el cursor, y
 * esperar la respuesta para dibujarla en su día nuevo la haría saltar dos veces.
 */
export function useRescheduleCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ card, dueDate }: RescheduleCardVariables) =>
      updateCard({ cardId: card.id, dueDate }),
    onMutate: async ({ card, dueDate }) => {
      const key = ['cards', card.listId, 'active']
      await queryClient.cancelQueries({ queryKey: key })

      const previous = queryClient.getQueryData<Card[]>(key)
      queryClient.setQueryData<Card[]>(key, (cards) =>
        cards?.map((item) =>
          item.id === card.id ? { ...item, dueDate } : item,
        ),
      )

      return { key, previous }
    },
    onSuccess: (_data, { card, dueDate }) => {
      notifications.show({
        message: `"${card.title}" vence el ${formatDueDate(dueDate)}`,
        color: 'success',
      })
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous)
      }
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
    onSettled: (_data, _error, { card }) => {
      queryClient.invalidateQueries({
        queryKey: ['cards', card.listId, 'active'],
      })
    },
  })
}
