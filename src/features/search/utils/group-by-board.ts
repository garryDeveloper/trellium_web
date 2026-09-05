import type { SearchCardHit } from '../types'

export interface BoardGroup {
  boardId: string
  boardName: string
  hits: SearchCardHit[]
}

/**
 * Agrupa las tarjetas por tablero (T11.2) respetando el orden en que llegaron:
 * el servidor ya las devolvió por relevancia, así que el tablero cuyo mejor
 * resultado es más relevante queda primero. Reordenar acá (alfabético, por
 * ejemplo) tiraría ese trabajo a la basura.
 */
export function groupHitsByBoard(hits: SearchCardHit[]): BoardGroup[] {
  const groups: BoardGroup[] = []
  const byBoardId = new Map<string, BoardGroup>()

  for (const hit of hits) {
    let group = byBoardId.get(hit.boardId)
    if (!group) {
      group = { boardId: hit.boardId, boardName: hit.boardName, hits: [] }
      byBoardId.set(hit.boardId, group)
      groups.push(group)
    }
    group.hits.push(hit)
  }

  return groups
}
