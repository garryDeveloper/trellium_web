import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { DueDateStatus } from '@/features/cards/utils/due-date'
import type { BoardFilter } from '../types'
import {
  EMPTY_BOARD_FILTER,
  countActiveFilters,
  isBoardFilterActive,
  parseBoardFilter,
  writeBoardFilter,
} from '../utils/board-filter'

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

/**
 * El filtro del tablero vive en la URL — misma técnica que `?card=<id>`, sin
 * store intermedio. Que la URL sea la fuente de verdad es lo que hace que
 * recargar o compartir el enlace conserve el filtro (criterio de T11.1).
 */
export function useBoardFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filter = useMemo(
    () => parseBoardFilter(searchParams),
    [searchParams],
  )

  const setFilter = useCallback(
    (next: BoardFilter) => {
      // `replace` y no push: escribir en el buscador de texto genera un cambio
      // por tecla, y empujarlos al historial dejaría el botón Atrás inservible.
      setSearchParams((prev) => writeBoardFilter(prev, next), { replace: true })
    },
    [setSearchParams],
  )

  const toggleMember = useCallback(
    (memberId: string) =>
      setFilter({ ...filter, memberIds: toggle(filter.memberIds, memberId) }),
    [filter, setFilter],
  )

  const toggleLabel = useCallback(
    (labelId: string) =>
      setFilter({ ...filter, labelIds: toggle(filter.labelIds, labelId) }),
    [filter, setFilter],
  )

  const toggleDue = useCallback(
    (due: DueDateStatus) =>
      setFilter({ ...filter, due: toggle(filter.due, due) }),
    [filter, setFilter],
  )

  const setText = useCallback(
    (text: string) => setFilter({ ...filter, text }),
    [filter, setFilter],
  )

  const clear = useCallback(
    () => setFilter(EMPTY_BOARD_FILTER),
    [setFilter],
  )

  return {
    filter,
    isActive: isBoardFilterActive(filter),
    activeCount: countActiveFilters(filter),
    toggleMember,
    toggleLabel,
    toggleDue,
    setText,
    clear,
  }
}
