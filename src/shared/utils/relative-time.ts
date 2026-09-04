const absoluteFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Fecha exacta, para el tooltip del momento relativo. */
export function formatAbsoluteDate(iso: string): string {
  return absoluteFormatter.format(new Date(iso))
}

const relativeFormatter = new Intl.RelativeTimeFormat('es-AR', {
  numeric: 'auto',
})

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

/**
 * "hace 5 minutos" pesa menos que una fecha completa en una lista larga; la
 * fecha exacta queda disponible en el tooltip. Lo usan comentarios y
 * notificaciones.
 */
export function formatRelativeDate(iso: string): string {
  let duration = (new Date(iso).getTime() - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeFormatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return formatAbsoluteDate(iso)
}
