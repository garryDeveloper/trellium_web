import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getBoardViewPreferences,
  saveBoardViewPreferences,
} from '../api/view-preferences.api'
import type { BoardViewPreferences } from '../types'

export function boardViewPreferencesKey(boardId: string | undefined) {
  return ['board-view-preferences', boardId] as const
}

export function useBoardViewPreferences(boardId: string | undefined) {
  return useQuery({
    queryKey: boardViewPreferencesKey(boardId),
    queryFn: () => getBoardViewPreferences(boardId!),
    enabled: !!boardId,
  })
}

/**
 * Guardar la preferencia es un efecto secundario de cambiar de vista: la vista
 * ya cambió en la URL antes de que responda el servidor. Por eso el cache se
 * escribe optimista y un fallo no muestra error — recordar la vista es una
 * comodidad, no una operación que el usuario haya pedido explícitamente.
 */
export function useSaveBoardViewPreferences(boardId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (preferences: BoardViewPreferences) =>
      saveBoardViewPreferences(boardId!, preferences),
    onMutate: (preferences) => {
      queryClient.setQueryData(boardViewPreferencesKey(boardId), preferences)
    },
  })
}
