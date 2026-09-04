import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getApiErrorMessage } from '@/shared/api/error'
import { toggleChecklistItem } from '../api/checklists.api'
import type { Checklist, ToggleChecklistItemPayload } from '../types'

/**
 * Marcar un ítem se refleja al instante y se revierte si el servidor rechaza
 * (`ui-guidelines.md` → feedback optimista). Sin esto, tildar tres ítems
 * seguidos se siente lento al no haber tiempo real.
 */
export function useToggleChecklistItem(cardId: string, listId: string) {
  const queryClient = useQueryClient()
  const checklistsKey = ['checklists', cardId]

  return useMutation({
    mutationFn: toggleChecklistItem,
    onMutate: async ({ itemId, completed }: ToggleChecklistItemPayload) => {
      await queryClient.cancelQueries({ queryKey: checklistsKey })
      const previous = queryClient.getQueryData<Checklist[]>(checklistsKey)

      queryClient.setQueryData<Checklist[]>(checklistsKey, (checklists) =>
        checklists?.map((checklist) => ({
          ...checklist,
          items: checklist.items.map((item) =>
            item.id === itemId ? { ...item, completed } : item,
          ),
        })),
      )

      return { previous }
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(checklistsKey, context.previous)
      }
      notifications.show({ message: getApiErrorMessage(error), color: 'danger' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: checklistsKey })
      // El contador de la tarjeta en el tablero también cambia.
      queryClient.invalidateQueries({ queryKey: ['cards', listId, 'active'] })
    },
  })
}
