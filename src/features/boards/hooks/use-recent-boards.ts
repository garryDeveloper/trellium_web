import { useEffect, useMemo } from 'react'
import { useBoards } from './use-boards'
import { useRecentBoardsStore } from '../store/recent-boards.store'
import type { BoardListItem } from '../types'

/**
 * Los tableros visitados últimamente, ya resueltos a datos frescos y en orden
 * de visita. Los ids que no resuelven (archivados, eliminados, o de los que el
 * usuario dejó de ser miembro) se caen solos.
 *
 * `enabled` existe porque el único consumidor es el command palette, montado en
 * el layout: sin él, cada carga de cualquier pantalla pediría `GET /boards`
 * para una lista que quizá nadie abra.
 */
export function useRecentBoards(enabled: boolean): BoardListItem[] {
  const boardIds = useRecentBoardsStore((state) => state.boardIds)
  const boardsQuery = useBoards('active', { enabled })

  return useMemo(() => {
    const byId = new Map(
      (boardsQuery.data ?? []).map((board) => [board.id, board]),
    )
    return boardIds
      .map((id) => byId.get(id))
      .filter((board): board is BoardListItem => board !== undefined)
  }, [boardIds, boardsQuery.data])
}

/** Registra la visita al tablero abierto. Lo llama la pantalla de tablero. */
export function useTrackRecentBoard(boardId: string | undefined) {
  const visit = useRecentBoardsStore((state) => state.visit)

  useEffect(() => {
    if (boardId) {
      visit(boardId)
    }
  }, [boardId, visit])
}
