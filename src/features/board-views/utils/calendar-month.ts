import type { Card } from '@/features/cards/types'

export interface CalendarDay {
  /** Medianoche local del día. */
  date: Date
  /** `YYYY-MM-DD` local — la clave con la que se agrupan las tarjetas. */
  key: string
  isCurrentMonth: boolean
  isToday: boolean
}

const DAYS_IN_WEEK = 7

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * Clave de día en hora LOCAL, nunca `toISOString().slice(0, 10)`: una tarjeta
 * que vence a las 21:00 en Buenos Aires es del día siguiente en UTC, y el
 * calendario la mostraría corrida un día.
 */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(month: Date, delta: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + delta, 1)
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Lunes = 0. La semana argentina empieza el lunes, no el domingo. */
function weekdayOffset(date: Date): number {
  return (date.getDay() + 6) % 7
}

/**
 * Las semanas completas que cubren el mes: arranca en el lunes anterior o igual
 * al día 1 y termina en el domingo posterior o igual al último día.
 *
 * Devuelve cuatro, cinco o seis semanas según lo que el mes necesite, y no seis
 * fijas: una fila vacía al final es una fila que el usuario tiene que descartar
 * con la vista cada vez que abre el calendario.
 */
export function buildMonthGrid(month: Date, today = new Date()): CalendarDay[] {
  const first = startOfMonth(month)
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()

  const leading = weekdayOffset(first)
  const weeks = Math.ceil((leading + daysInMonth) / DAYS_IN_WEEK)
  const todayKey = toDayKey(today)

  return Array.from({ length: weeks * DAYS_IN_WEEK }, (_, index) => {
    const date = new Date(
      first.getFullYear(),
      first.getMonth(),
      1 - leading + index,
    )
    const key = toDayKey(date)
    return {
      date,
      key,
      isCurrentMonth: isSameMonth(date, month),
      isToday: key === todayKey,
    }
  })
}

const MONTH_PARAM_PATTERN = /^(\d{4})-(\d{2})$/

/** `YYYY-MM`; cualquier otra cosa (URL editada a mano) se descarta. */
export function parseMonthParam(value: string | null): Date | null {
  const match = MONTH_PARAM_PATTERN.exec(value ?? '')
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null

  return new Date(year, month - 1, 1)
}

export function formatMonthParam(month: Date): string {
  return `${month.getFullYear()}-${pad(month.getMonth() + 1)}`
}

/**
 * La fecha límite movida a otro día, conservando la hora original.
 *
 * Arrastrar cambia el día, no la hora: una tarjeta que vencía a las 18:00 sigue
 * venciendo a las 18:00. Devuelve una fecha nueva — la fecha límite se
 * sobrescribe, nunca se acumula (`domain.md`, regla 7).
 */
export function moveDueDateToDay(dueDate: string, day: Date): string {
  const source = new Date(dueDate)
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    source.getHours(),
    source.getMinutes(),
  ).toISOString()
}

/**
 * Agrupa por día local las tarjetas que tienen fecha límite. Dentro de cada día
 * quedan ordenadas por hora: el día es una agenda, no un montón.
 */
export function groupCardsByDay(cards: Card[]): Record<string, Card[]> {
  const byDay: Record<string, Card[]> = {}

  for (const card of cards) {
    if (!card.dueDate) continue
    const key = toDayKey(new Date(card.dueDate))
    ;(byDay[key] ??= []).push(card)
  }

  for (const dayCards of Object.values(byDay)) {
    dayCards.sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
    )
  }

  return byDay
}

const monthTitleFormatter = new Intl.DateTimeFormat('es-AR', {
  month: 'long',
  year: 'numeric',
})

export function formatMonthTitle(month: Date): string {
  return monthTitleFormatter.format(month)
}

const dayLabelFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

/** Para el `aria-label` de la celda: el número solo no dice de qué día se trata. */
export function formatDayLabel(date: Date): string {
  return dayLabelFormatter.format(date)
}

const weekdayFormatter = new Intl.DateTimeFormat('es-AR', { weekday: 'short' })

/**
 * Los siete encabezados, de lunes a domingo. Salen de un lunes real y no de una
 * lista escrita a mano para que el idioma lo decida `Intl`, como el resto.
 */
export const WEEKDAY_LABELS = Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
  weekdayFormatter.format(new Date(2024, 0, 1 + index)),
)
