import { useBoards } from './use-boards'

/**
 * No existe un endpoint de detalle de tablero (`GET /boards/{boardId}`) en la
 * API todavía, así que el tablero se deriva de la cache de "Mis tableros"
 * (activos + archivados) por id.
 */
export function useBoard(boardId: string | undefined) {
  const activeBoards = useBoards('active')
  const archivedBoards = useBoards('archived')

  const board =
    activeBoards.data?.find((b) => b.id === boardId) ??
    archivedBoards.data?.find((b) => b.id === boardId)

  return {
    board,
    isLoading: activeBoards.isLoading || archivedBoards.isLoading,
  }
}
