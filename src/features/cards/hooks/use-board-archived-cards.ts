import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { List } from '@/features/lists/types'
import { listCards } from '../api/cards.api'
import type { Card } from '../types'

export interface ArchivedCardWithListName extends Card {
  listName: string
}

/**
 * Tarjetas archivadas pueden quedar tanto en una lista activa como en una
 * lista archivada (archivar una tarjeta no cambia su lista). Se consultan
 * todas las listas del tablero (activas + archivadas) para juntarlas todas.
 */
export function useBoardArchivedCards(allLists: List[]) {
  const queries = useQueries({
    queries: allLists.map((list) => ({
      queryKey: ['cards', list.id, 'archived'],
      queryFn: () => listCards(list.id, 'archived'),
    })),
  })

  const cards = useMemo(() => {
    const result: ArchivedCardWithListName[] = []
    allLists.forEach((list, index) => {
      const listCardsData = queries[index]?.data ?? []
      listCardsData.forEach((card) => {
        result.push({ ...card, listName: list.name })
      })
    })
    return result.sort((a, b) => a.title.localeCompare(b.title))
  }, [allLists, queries])

  return {
    cards,
    isLoading: allLists.length > 0 && queries.some((query) => query.isLoading),
  }
}
