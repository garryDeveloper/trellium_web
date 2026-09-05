import type { Comment } from '@/features/comments/types'
import type { Activity } from '../types'

export type TimelineItem =
  | { kind: 'comment'; id: string; createdAt: string; comment: Comment }
  | { kind: 'activity'; id: string; createdAt: string; activity: Activity }

/**
 * Comentarios y eventos en una sola línea de tiempo, del más viejo al más
 * nuevo — el orden en el que ya se leían los comentarios, con lo último arriba
 * del campo para escribir.
 *
 * Vienen de dos endpoints distintos (`endpoints.md`) porque son cosas
 * distintas: un comentario es contenido editable de una persona, un evento es
 * un registro inmutable del sistema. Se juntan acá, para leerlos.
 */
export function buildTimeline(
  comments: Comment[],
  activities: Activity[],
  includeActivities: boolean,
): TimelineItem[] {
  const items: TimelineItem[] = comments.map((comment) => ({
    kind: 'comment',
    id: `comment-${comment.id}`,
    createdAt: comment.createdAt,
    comment,
  }))

  if (includeActivities) {
    for (const activity of activities) {
      // `comment_added` existe para el panel del tablero (T13.2); acá el
      // comentario real ya está en la lista y sería la misma línea dos veces.
      if (activity.type === 'comment_added') continue

      items.push({
        kind: 'activity',
        id: `activity-${activity.id}`,
        createdAt: activity.createdAt,
        activity,
      })
    }
  }

  return items.sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}
