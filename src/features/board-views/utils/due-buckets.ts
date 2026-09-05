import type { MyCardHit } from '../types'
import { toDayKey } from './calendar-month'

export const DUE_BUCKETS = ['overdue', 'today', 'week', 'later', 'none'] as const
export type DueBucket = (typeof DUE_BUCKETS)[number]

export const DUE_BUCKET_LABEL: Record<DueBucket, string> = {
  overdue: 'Vencidas',
  today: 'Hoy',
  week: 'Esta semana',
  later: 'Más adelante',
  none: 'Sin fecha',
}

const WEEK_DAYS = 7

/**
 * En qué grupo de urgencia cae una tarjeta (T12.4).
 *
 * "Esta semana" son los próximos siete días y no lo que queda de la semana
 * calendario: un viernes a la tarde, la semana calendario está casi vacía y el
 * grupo dejaría de responder la pregunta que la pantalla hace ("¿qué me toca
 * ahora?"). Todo se calcula en hora local, que es donde está el reloj del
 * usuario — el servidor no sabe en qué día está quien mira.
 */
export function getDueBucket(dueDate: string | null, now = new Date()): DueBucket {
  if (!dueDate) return 'none'

  const due = new Date(dueDate)
  if (due.getTime() < now.getTime()) return 'overdue'
  if (toDayKey(due) === toDayKey(now)) return 'today'

  const endOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + WEEK_DAYS,
    23,
    59,
    59,
    999,
  )
  return due.getTime() <= endOfWeek.getTime() ? 'week' : 'later'
}

export interface DueBucketGroup {
  bucket: DueBucket
  label: string
  hits: MyCardHit[]
}

/**
 * Agrupa en el orden fijo de los grupos, de lo más urgente a lo que no corre.
 * Un grupo vacío no se devuelve: "Vencidas: 0" es ruido, y peor, se lee como un
 * encabezado con contenido colapsado.
 */
export function groupByDueBucket(
  hits: MyCardHit[],
  now = new Date(),
): DueBucketGroup[] {
  const byBucket = new Map<DueBucket, MyCardHit[]>()

  for (const hit of hits) {
    const bucket = getDueBucket(hit.card.dueDate, now)
    byBucket.set(bucket, [...(byBucket.get(bucket) ?? []), hit])
  }

  return DUE_BUCKETS.filter((bucket) => byBucket.get(bucket)?.length).map(
    (bucket) => ({
      bucket,
      label: DUE_BUCKET_LABEL[bucket],
      hits: byBucket.get(bucket) ?? [],
    }),
  )
}
