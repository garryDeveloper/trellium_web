import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  TABLE_SORT_COLUMNS,
  type SortDirection,
  type TableSort,
  type TableSortColumn,
} from '../types'

function parseColumn(value: string | null): TableSortColumn | null {
  return (TABLE_SORT_COLUMNS as readonly string[]).includes(value ?? '')
    ? (value as TableSortColumn)
    : null
}

function parseDirection(value: string | null): SortDirection {
  return value === 'desc' ? 'desc' : 'asc'
}

/**
 * Orden de la vista Tabla, también en la URL: es parte del estado de la vista,
 * como el filtro y la vista misma.
 *
 * `null` significa "el orden del tablero" (lista por posición, tarjeta por
 * posición dentro de la lista). Existe como estado propio y no como una opción
 * más del ciclo porque es el único orden que coincide con lo que muestra la
 * vista Tablero: se vuelve a él con un tercer clic en la misma columna.
 */
export function useTableSort() {
  const [searchParams, setSearchParams] = useSearchParams()

  const sort = useMemo<TableSort | null>(() => {
    const column = parseColumn(searchParams.get('sort'))
    if (!column) return null
    return { column, direction: parseDirection(searchParams.get('dir')) }
  }, [searchParams])

  const toggleSort = useCallback(
    (column: TableSortColumn) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        const isSameColumn = sort?.column === column

        if (isSameColumn && sort.direction === 'asc') {
          params.set('sort', column)
          params.set('dir', 'desc')
        } else if (isSameColumn && sort.direction === 'desc') {
          params.delete('sort')
          params.delete('dir')
        } else {
          params.set('sort', column)
          params.set('dir', 'asc')
        }

        return params
      })
    },
    [setSearchParams, sort],
  )

  return { sort, toggleSort }
}
