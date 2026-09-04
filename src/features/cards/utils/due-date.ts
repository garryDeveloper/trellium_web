export type DueDateStatus = 'none' | 'on-time' | 'due-soon' | 'overdue'

const DUE_SOON_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24 horas

export function getDueDateStatus(dueDate: string | null): DueDateStatus {
  if (!dueDate) return 'none'
  const diff = new Date(dueDate).getTime() - Date.now()
  if (diff < 0) return 'overdue'
  if (diff <= DUE_SOON_THRESHOLD_MS) return 'due-soon'
  return 'on-time'
}

export const DUE_DATE_STATUS_LABEL: Record<DueDateStatus, string> = {
  none: 'Sin fecha',
  'on-time': 'A tiempo',
  'due-soon': 'Vence pronto',
  overdue: 'Vencida',
}

/**
 * "A tiempo" es deliberadamente neutro: si toda fecha futura fuera azul, el
 * tablero gritaría y la urgencia real se perdería. Solo se tiñe la excepción.
 */
export const DUE_DATE_STATUS_COLOR: Record<DueDateStatus, string> = {
  none: 'gray',
  'on-time': 'gray',
  'due-soon': 'warning',
  overdue: 'danger',
}

const dueDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDueDate(dueDate: string): string {
  return dueDateFormatter.format(new Date(dueDate))
}

const shortDueDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
})

/** Versión compacta para la meta row de la card en el tablero. */
export function formatDueDateShort(dueDate: string): string {
  return shortDueDateFormatter.format(new Date(dueDate))
}

/** Convierte un ISO string (UTC) al formato local que espera <input type="datetime-local">. */
export function toDateTimeLocalValue(iso: string): string {
  const date = new Date(iso)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Convierte el valor local de <input type="datetime-local"> a un ISO string (UTC). */
export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}
