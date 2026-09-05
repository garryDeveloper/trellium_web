import {
  IconCalendarEvent,
  IconChecklist,
  IconLayoutKanban,
  IconListDetails,
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import {
  formatDueDate,
  getDueDateStatus,
} from '@/features/cards/utils/due-date'
import { LabelChip } from '@/features/labels/components/label-chip'
import type { MyCardHit } from '../types'
import classes from './my-work-card-row.module.css'

interface MyWorkCardRowProps {
  hit: MyCardHit
  onOpen: () => void
}

/**
 * Una tarjeta asignada, en fila. Abre el detalle sobre esta misma pantalla —no
 * navega al tablero— para que cerrarlo devuelva a "Mi trabajo" donde estaba
 * (criterio de T12.4). El nombre del tablero sí es un enlace: es el camino a
 * "quiero ver esto en contexto".
 */
export function MyWorkCardRow({ hit, onOpen }: MyWorkCardRowProps) {
  const { card } = hit
  const dueStatus = getDueDateStatus(card.dueDate)
  const progress = card.checklistProgress

  return (
    <div
      className={classes.row}
      role="button"
      tabIndex={0}
      aria-label={`Abrir tarjeta ${card.title}, en ${hit.boardName}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      {card.labels.length > 0 && (
        <div className={classes.labels}>
          {card.labels.map((label) => (
            <LabelChip key={label.id} label={label} size="xs" />
          ))}
        </div>
      )}

      <p className={classes.title}>{card.title}</p>

      <div className={classes.meta}>
        <Link
          to={`/boards/${hit.boardId}`}
          className={classes.boardLink}
          onClick={(event) => event.stopPropagation()}
        >
          <IconLayoutKanban size={12} />
          {hit.boardName}
        </Link>

        <span className={classes.metaItem}>
          <IconListDetails size={12} />
          {hit.listName}
        </span>

        {card.dueDate && (
          <span
            className={[
              classes.metaItem,
              dueStatus === 'due-soon' && classes.dueWarning,
              dueStatus === 'overdue' && classes.dueDanger,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <IconCalendarEvent size={12} />
            {formatDueDate(card.dueDate)}
          </span>
        )}

        {progress && (
          <span
            className={classes.metaItem}
            title={`Checklist: ${progress.completed} de ${progress.total} completados`}
          >
            <IconChecklist size={12} />
            {progress.completed}/{progress.total}
          </span>
        )}
      </div>
    </div>
  )
}
