import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  addMonths,
  formatMonthParam,
  isSameMonth,
  parseMonthParam,
  startOfMonth,
} from '../utils/calendar-month'

/**
 * Qué mes muestra el calendario (T12.2), en la URL como el resto del estado de
 * vista: recargar o compartir el enlace conserva el mes que se estaba mirando.
 *
 * El mes en curso no escribe parámetro — es el default, y una URL que dice
 * `?month=2026-09` un 5 de septiembre sólo agrega ruido. Por eso "Hoy" borra el
 * parámetro en vez de escribir el mes actual.
 */
export function useCalendarMonth() {
  const [searchParams, setSearchParams] = useSearchParams()

  const month = useMemo(
    () => parseMonthParam(searchParams.get('month')) ?? startOfMonth(new Date()),
    [searchParams],
  )

  const isCurrentMonth = isSameMonth(month, new Date())

  const setMonth = useCallback(
    (next: Date) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        if (isSameMonth(next, new Date())) {
          params.delete('month')
        } else {
          params.set('month', formatMonthParam(next))
        }
        return params
      })
    },
    [setSearchParams],
  )

  return {
    month,
    isCurrentMonth,
    goToPreviousMonth: useCallback(
      () => setMonth(addMonths(month, -1)),
      [month, setMonth],
    ),
    goToNextMonth: useCallback(
      () => setMonth(addMonths(month, 1)),
      [month, setMonth],
    ),
    goToToday: useCallback(() => setMonth(new Date()), [setMonth]),
  }
}
