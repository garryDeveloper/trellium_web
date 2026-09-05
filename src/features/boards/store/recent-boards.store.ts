import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Suficientes para que la paleta sirva de atajo, pocas para poder leerlas de un vistazo. */
const MAX_RECENT_BOARDS = 5

interface RecentBoardsState {
  /** Del más reciente al más antiguo. */
  boardIds: string[]
  visit: (boardId: string) => void
}

/**
 * Tableros visitados últimamente, para los accesos recientes del command
 * palette (T11.3). Es estado de cliente durable —sobrevive al refresh, no lo
 * conoce el servidor—, que es exactamente el caso de Zustand + `persist`
 * (`frontend-architecture.md`).
 *
 * Guarda **sólo ids**: el nombre se resuelve contra la lista de tableros que ya
 * trae TanStack Query. Así un tablero renombrado nunca aparece con el nombre
 * viejo, y uno que se archivó o del que te sacaron simplemente deja de
 * resolverse en vez de quedar como un acceso roto.
 */
export const useRecentBoardsStore = create<RecentBoardsState>()(
  persist(
    (set) => ({
      boardIds: [],
      visit: (boardId) =>
        set((state) => ({
          boardIds: [
            boardId,
            ...state.boardIds.filter((id) => id !== boardId),
          ].slice(0, MAX_RECENT_BOARDS),
        })),
    }),
    { name: 'trellium-recent-boards' },
  ),
)
