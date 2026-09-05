import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  BOARD_VIEWS,
  DEFAULT_BOARD_VIEW_PREFERENCES,
  type BoardView,
} from '../types'
import {
  useBoardViewPreferences,
  useSaveBoardViewPreferences,
} from './use-board-view-preferences'

function parseView(value: string | null): BoardView | null {
  return (BOARD_VIEWS as readonly string[]).includes(value ?? '')
    ? (value as BoardView)
    : null
}

/**
 * Qué vista del tablero se está mirando (T12.1).
 *
 * La URL manda y la preferencia guardada sólo actúa como valor inicial
 * (`frontend-architecture.md`): así un enlace compartido se ve como lo dejó
 * quien lo compartió, sin pisarle la preferencia a quien lo abre. Elegir una
 * vista hace las dos cosas — escribe la URL y persiste la preferencia — para
 * que mañana el tablero abra donde se lo dejó.
 */
export function useBoardView(boardId: string | undefined) {
  const [searchParams, setSearchParams] = useSearchParams()
  const preferencesQuery = useBoardViewPreferences(boardId)
  const saveMutation = useSaveBoardViewPreferences(boardId)

  const preferences = preferencesQuery.data ?? DEFAULT_BOARD_VIEW_PREFERENCES
  const viewFromUrl = parseView(searchParams.get('view'))
  const view = viewFromUrl ?? preferences.view

  const setView = useCallback(
    (next: BoardView) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        params.set('view', next)
        // La tarjeta abierta pertenece a la vista que se deja atrás; el detalle
        // se abre igual desde cualquiera de las tres, pero arrastrarlo al
        // cambiar de vista hace que el panel tape la vista recién elegida.
        params.delete('card')
        return params
      })
      if (boardId) {
        saveMutation.mutate({ ...preferences, view: next })
      }
    },
    [boardId, preferences, saveMutation, setSearchParams],
  )

  return {
    view,
    setView,
    /*
      Sin esto, el tablero de alguien que dejó la vista Tabla se dibujaría en
      columnas por un instante y saltaría a la tabla al llegar la preferencia.
      Sólo importa cuando la URL no trae vista: si la trae, ya está decidido.
    */
    isResolving: !viewFromUrl && preferencesQuery.isLoading,
  }
}
