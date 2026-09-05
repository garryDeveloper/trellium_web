export const BOARD_VIEWS = ['board', 'table', 'calendar'] as const
export type BoardView = (typeof BOARD_VIEWS)[number]

export const BOARD_GROUP_BYS = ['list', 'assignee', 'label', 'due_date'] as const
export type BoardGroupBy = (typeof BOARD_GROUP_BYS)[number]

/** Cómo se nombra cada agrupación en el selector y en el aviso. */
export const BOARD_GROUP_BY_LABEL: Record<BoardGroupBy, string> = {
  list: 'Lista',
  assignee: 'Miembro',
  label: 'Etiqueta',
  due_date: 'Vencimiento',
}

/** Lo que el servidor recuerda por tablero y por usuario (T12.1, T12.3). */
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
