import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Avatar, Tooltip } from '@mantine/core'
import { IconAlertTriangle, IconClock } from '@tabler/icons-react'
import type { Card } from '@/features/cards/types'
import {
  DUE_DATE_STATUS_LABEL,
  formatDueTime,
  getDueDateStatus,
} from '@/features/cards/utils/due-date'
import { LabelChip } from '@/features/labels/components/label-chip'
import classes from './board-calendar-view.module.css'

const MAX_VISIBLE_ASSIGNEES = 2

interface CalendarCardChipProps {
  card: Card
  onOpen?: () => void
}

/**
 * Contenido del chip, sin nada de drag-and-drop: lo comparten el chip que vive
 * en la celda y la copia que sigue al cursor, igual que `card-tile-body` con la
 * tarjeta del tablero.
 */
function CalendarCardChipBody({ card }: { card: Card }) {
  const status = getDueDateStatus(card.dueDate)
  const isOverdue = status === 'overdue'
  const visibleAssignees = card.assignees.slice(0, MAX_VISIBLE_ASSIGNEES)
  const hiddenAssignees = card.assignees.length - visibleAssignees.length

  return (
    <>
      {card.labels.length > 0 && (
        <div className={classes.chipLabels}>
          {card.labels.map((label) => (
            <LabelChip key={label.id} label={label} size="xs" />
          ))}
        </div>
      )}

      <p className={classes.chipTitle}>{card.title}</p>

      <div className={classes.chipMeta}>
        {/* El vencimiento no se comunica sólo por color: el ícono cambia y el
            título lo dice con palabras (ui-guidelines.md). */}
        <span
          className={[
            classes.chipTime,
            status === 'due-soon' && classes.chipTimeWarning,
            isOverdue && classes.chipTimeDanger,
          ]
            .filter(Boolean)
            .join(' ')}
          title={DUE_DATE_STATUS_LABEL[status]}
        >
          {isOverdue ? <IconAlertTriangle size={12} /> : <IconClock size={12} />}
          {card.dueDate && formatDueTime(card.dueDate)}
        </span>

        {card.assignees.length > 0 && (
          <Avatar.Group spacing="xs" className={classes.chipAssignees}>
            {visibleAssignees.map((assignee) => (
              <Tooltip key={assignee.id} label={assignee.name}>
                <Avatar
                  name={assignee.name}
                  color="initials"
                  radius="xl"
                  size={18}
                />
              </Tooltip>
            ))}
            {hiddenAssignees > 0 && (
              <Avatar radius="xl" size={18} color="gray">
                +{hiddenAssignees}
              </Avatar>
            )}
          </Avatar.Group>
        )}
      </div>
    </>
  )
}

/** La copia que sigue al cursor mientras se arrastra hacia otro día. */
export function CalendarCardDragPreview({ card }: { card: Card }) {
  return (
    <div className={[classes.chip, classes.chipDragPreview].join(' ')}>
      <CalendarCardChipBody card={card} />
    </div>
  )
}

/**
 * Una tarjeta dentro de su día. Se arrastra a otro día para cambiarle la fecha
 * límite y se hace clic para abrir el mismo detalle que desde el tablero.
 */
export function CalendarCardChip({ card, onOpen }: CalendarCardChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: card.id, data: { type: 'calendar-card', card } })

  return (
    <div
      ref={setNodeRef}
      className={[classes.chip, isDragging && classes.chipDragging]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Abrir tarjeta ${card.title}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen?.()
        }
      }}
      style={{ transform: CSS.Transform.toString(transform) }}
      {...attributes}
      {...listeners}
    >
      <CalendarCardChipBody card={card} />
    </div>
  )
}
