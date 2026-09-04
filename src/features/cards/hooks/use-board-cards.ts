import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { List } from '@/features/lists/types'
import { listCards } from '../api/cards.api'
import type { Card, CardStatus } from '../types'

/**
 * Trae las tarjetas de todas las listas de un tablero en paralelo. No hay un
 * endpoint que devuelva todas de una vez (`GET /lists/{listId}/cards` está
 * scopeado a una lista, simétrico a `POST /lists/{listId}/cards`), así que se
 * arma client-side agrupando por lista.
 */
export function useBoardCards(lists: List[], status: CardStatus = 'active') {
  const queries = useQueries({
    queries: lists.map((list) => ({
      queryKey: ['cards', list.id, status],
      queryFn: () => listCards(list.id, status),
    })),
  })

  const cardsByList = useMemo(() => {
    const map: Record<string, Card[]> = {}
    lists.forEach((list, index) => {
      map[list.id] = queries[index]?.data ?? []
    })
    return map
  }, [lists, queries])

  return {
    cardsByList,
    isLoading: queries.some((query) => query.isLoading),
  }
}
