export const BOARD_VIEWS = ['board', 'table', 'calendar'] as const
export type BoardView = (typeof BOARD_VIEWS)[number]

export type BoardGroupBy = 'list' | 'assignee' | 'label' | 'due_date'

/**
 * Lo que el servidor recuerda por tablero y por usuario (T12.1, T12.3).
 * `groupBy` todavía no tiene UI — es de T12.3 —, pero viaja en el contrato
 * desde ahora para no versionar el endpoint cuando llegue.
 */
export interface BoardViewPreferences {
  view: BoardView
  groupBy: BoardGroupBy
}

export const DEFAULT_BOARD_VIEW_PREFERENCES: BoardViewPreferences = {
  view: 'board',
  groupBy: 'list',
}

export const TABLE_SORT_COLUMNS = [
  'title',
  'list',
  'assignees',
  'labels',
  'dueDate',
  'progress',
] as const
export type TableSortColumn = (typeof TABLE_SORT_COLUMNS)[number]

export type SortDirection = 'asc' | 'desc'

export interface TableSort {
  column: TableSortColumn
  direction: SortDirection
}
