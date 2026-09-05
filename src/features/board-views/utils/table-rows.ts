import type { BoardFilter } from '@/features/boards/types'
import { matchesBoardFilter } from '@/features/boards/utils/board-filter'
import type { Card } from '@/features/cards/types'
import type { List } from '@/features/lists/types'
import type { TableSort } from '../types'

export interface TableRow {
  card: Card
  listId: string
  listName: string
}

/**
 * Aplana el tablero a una fila por tarjeta activa. Es una proyección: el orden
 * de partida es el del tablero (listas por posición, tarjetas por su posición
 * dentro de la lista) y nada de lo que pase acá toca la pertenencia ni la
 * posición de una tarjeta (`domain.md`, regla 4).
 */
export function buildTableRows(
  lists: List[],
  cardsByList: Record<string, Card[]>,
  filter: BoardFilter,
): TableRow[] {
  return lists.flatMap((list) =>
    (cardsByList[list.id] ?? [])
      .filter((card) => matchesBoardFilter(card, filter))
      .map((card) => ({ card, listId: list.id, listName: list.name })),
  )
}

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true })

/**
 * Valor de comparación de cada columna. `null` es "vacío": no participa del
 * orden, se va al final. Sin fecha no es "antes de todas las fechas" ni
 * "después": es la ausencia del dato, y mezclarla con los valores reales
 * escondería las tarjetas con fecha detrás de un bloque de vacías al invertir.
 */
type SortValue = string | number | null

function sortValue(row: TableRow, column: TableSort['column']): SortValue {
  switch (column) {
    case 'title':
      return row.card.title
    case 'list':
      return row.listName
    case 'assignees':
      return row.card.assignees[0]?.name ?? null
    case 'labels':
      return row.card.labels[0]?.name ?? null
    case 'dueDate':
      return row.card.dueDate ? new Date(row.card.dueDate).getTime() : null
    case 'progress': {
      const progress = row.card.checklistProgress
      if (!progress || progress.total === 0) return null
      return progress.completed / progress.total
    }
  }
}

function compare(a: SortValue, b: SortValue): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return collator.compare(String(a), String(b))
}

/**
 * Ordena sin mutar. Las filas sin valor en la columna quedan siempre al final,
 * en los dos sentidos, y conservan entre sí el orden del tablero.
 */
export function sortTableRows(
  rows: TableRow[],
  sort: TableSort | null,
): TableRow[] {
  if (!sort) return rows

  const factor = sort.direction === 'asc' ? 1 : -1

  return [...rows].sort((rowA, rowB) => {
    const a = sortValue(rowA, sort.column)
    const b = sortValue(rowB, sort.column)

    if (a === null && b === null) return 0
    if (a === null) return 1
    if (b === null) return -1

    return compare(a, b) * factor
  })
}
