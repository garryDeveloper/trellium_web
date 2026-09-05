import type { Board } from '@/features/boards/types'
import type { Card } from '@/features/cards/types'

/**
 * Una tarjeta encontrada, con el tablero y la lista donde vive. La tarjeta sola
 * no alcanza: los resultados se agrupan por tablero e indican la lista (T11.2),
 * y sin el `boardId` tampoco habría a dónde navegar.
 */
export interface SearchCardHit {
  card: Card
  listId: string
  listName: string
  boardId: string
  boardName: string
}

export interface SearchResults {
  cards: SearchCardHit[]
  boards: Board[]
}

export interface SearchParams {
  q: string
  includeArchived: boolean
}

/** Mínimo que acepta `GET /search`; por debajo no se llama al servidor. */
export const MIN_SEARCH_LENGTH = 2
