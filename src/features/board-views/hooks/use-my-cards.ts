import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { listMyCards } from '../api/my-cards.api'

export const MY_CARDS_QUERY_KEY = ['my-cards'] as const

export function useMyCards() {
  return useQuery({
    queryKey: MY_CARDS_QUERY_KEY,
    queryFn: listMyCards,
  })
}

/**
 * Editar una tarjeta desde el detalle invalida el cache de SU lista, que es
 * otra query: "Mi trabajo" no se entera. Como el detalle se abre y se cierra
 * sobre la misma pantalla, refrescar al cerrarlo alcanza para que la tarjeta
 * cambie de grupo —o desaparezca, si se archivó— al volver a la lista.
 */
export function useRefreshMyCards() {
  const queryClient = useQueryClient()
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: MY_CARDS_QUERY_KEY }),
    [queryClient],
  )
}
