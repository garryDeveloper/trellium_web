import type { ReactNode } from 'react'
import { LabelChip } from '@/features/labels/components/label-chip'
import { formatDueDate } from '@/features/cards/utils/due-date'
import type { Activity } from '../types'
import classes from './activity-item.module.css'

/** El payload viene del servidor como JSON: se lee con cuidado, no se asume. */
function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function Strong({ children }: { children: ReactNode }) {
  return <span className={classes.value}>{children}</span>
}

interface ActivityDescriptionProps {
  activity: Activity
  /** Para decir "se asignó" en vez de "asignó a Ana" cuando es la misma persona. */
  isSelfAction: boolean
}

/**
 * Qué dice cada evento. Los valores salen del payload —ya resueltos cuando el
 * evento ocurrió—, así que la frase sigue siendo cierta aunque la lista se
 * haya renombrado o la etiqueta ya no exista (`domain.md`, regla 18).
 *
 * El texto se arma en el cliente y no viaja hecho desde el servidor, igual que
 * en las notificaciones: es presentación, y acá es donde están el idioma, los
 * formatos de fecha y el chip de la etiqueta.
 */
export function ActivityDescription({
  activity,
  isSelfAction,
}: ActivityDescriptionProps) {
  const { payload } = activity

  switch (activity.type) {
    case 'card_created':
      return (
        <>
          creó esta tarjeta en <Strong>{text(payload.listName)}</Strong>
        </>
      )
    case 'card_moved':
      return (
        <>
          la movió de <Strong>{text(payload.fromListName)}</Strong> a{' '}
          <Strong>{text(payload.toListName)}</Strong>
        </>
      )
    case 'card_renamed':
      return (
        <>
          cambió el título: <Strong>{text(payload.previousTitle)}</Strong> →{' '}
          <Strong>{text(payload.cardTitle)}</Strong>
        </>
      )
    case 'card_described':
      return payload.cleared === true ? (
        <>borró la descripción</>
      ) : (
        <>cambió la descripción</>
      )
    case 'card_archived':
      return <>archivó la tarjeta</>
    case 'card_unarchived':
      return <>restauró la tarjeta</>
    case 'assignee_added':
      return isSelfAction ? (
        <>se asignó la tarjeta</>
      ) : (
        <>
          asignó a <Strong>{text(payload.memberName)}</Strong>
        </>
      )
    case 'assignee_removed':
      return isSelfAction ? (
        <>se quitó de la tarjeta</>
      ) : (
        <>
          quitó a <Strong>{text(payload.memberName)}</Strong>
        </>
      )
    case 'label_applied':
    case 'label_removed':
      return (
        <>
          {activity.type === 'label_applied' ? 'agregó' : 'quitó'} la etiqueta{' '}
          <LabelChip
            label={{
              id: activity.id,
              boardId: activity.boardId,
              name: text(payload.labelName),
              color: text(payload.labelColor),
            }}
            size="xs"
          />
        </>
      )
    case 'due_date_set':
      return (
        <>
          puso la fecha límite el{' '}
          <Strong>{formatDueDate(text(payload.dueDate))}</Strong>
        </>
      )
    case 'due_date_cleared':
      return <>quitó la fecha límite</>
    case 'attachment_added':
      return (
        <>
          adjuntó <Strong>{text(payload.fileName)}</Strong>
        </>
      )
    case 'attachment_removed':
      return (
        <>
          eliminó el adjunto <Strong>{text(payload.fileName)}</Strong>
        </>
      )
    default:
      // Un tipo que este cliente todavía no conoce. Decir "hizo un cambio" es
      // menos útil que la frase real, pero deja el historial completo y en
      // orden en vez de esconder una línea.
      return <>hizo un cambio</>
  }
}
