import { Avatar, Badge, Tooltip } from '@mantine/core'
import {
  IconCalendarEvent,
  IconChecklist,
  IconListDetails,
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { LabelChip } from '@/features/labels/components/label-chip'
import {
  formatDueDateShort,
  getDueDateStatus,
} from '@/features/cards/utils/due-date'
import type { SearchCardHit } from '../types'
import classes from './search-result-card.module.css'

const MAX_VISIBLE_ASSIGNEES = 3

interface SearchResultCardProps {
  hit: SearchCardHit
}

/**
 * Un resultado de tarjeta. Es un `Link` y no un botón: un resultado de búsqueda
 * es una dirección, y la gente espera poder abrirlo en otra pestaña.
 *
 * `?card=` es el mismo parámetro con el que el tablero ya sincroniza la tarjeta
 * abierta, así que llegar desde acá y abrirla haciendo click adentro del
 * tablero terminan exactamente en la misma URL.
 */
export function SearchResultCard({ hit }: SearchResultCardProps) {
  const { card } = hit
  const dueStatus = getDueDateStatus(card.dueDate)
  const progress = card.checklistProgress
  const visibleAssignees = card.assignees.slice(0, MAX_VISIBLE_ASSIGNEES)
  const hiddenAssigneesCount = card.assignees.length - visibleAssignees.length

  return (
    <Link
      to={`/boards/${hit.boardId}?card=${card.id}`}
      className={classes.row}
      aria-label={`${card.title}, en la lista ${hit.listName}`}
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
        <span className={classes.metaItem}>
          <IconListDetails size={12} />
          {hit.listName}
        </span>

        {card.status === 'archived' && (
          <Badge color="gray" variant="light" size="xs">
            Archivada
          </Badge>
        )}

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
            {formatDueDateShort(card.dueDate)}
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

        {card.assignees.length > 0 && (
          <Avatar.Group spacing="xs">
            {visibleAssignees.map((assignee) => (
              <Tooltip key={assignee.id} label={assignee.name}>
                <Avatar
                  name={assignee.name}
                  color="initials"
                  radius="xl"
                  size={20}
                />
              </Tooltip>
            ))}
            {hiddenAssigneesCount > 0 && (
              <Avatar radius="xl" size={20} color="gray">
                +{hiddenAssigneesCount}
              </Avatar>
            )}
          </Avatar.Group>
        )}
      </div>
    </Link>
  )
}
