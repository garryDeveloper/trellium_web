import { ActionIcon, Avatar, Menu, Tooltip } from '@mantine/core'
import {
  IconArchive,
  IconArrowsMove,
  IconCalendarEvent,
  IconChecklist,
  IconDotsVertical,
} from '@tabler/icons-react'
import { LabelChip } from '@/features/labels/components/label-chip'
import { useArchiveCard } from '../hooks/use-archive-card'
import type { Card } from '../types'
import { formatDueDateShort, getDueDateStatus } from '../utils/due-date'
import classes from './card-tile.module.css'

const MAX_VISIBLE_ASSIGNEES = 3

interface CardTileBodyProps {
  card: Card
  /**
   * Sin handler no se renderiza el menú: es el caso de la copia que sigue al
   * cursor durante el arrastre, que se ve igual pero no se opera.
   */
  onMoveToClick?: () => void
}

/** Contenido visual de una tarjeta, sin nada de drag-and-drop ni de foco. */
export function CardTileBody({ card, onMoveToClick }: CardTileBodyProps) {
  const archiveMutation = useArchiveCard(card.listId)

  const visibleAssignees = card.assignees.slice(0, MAX_VISIBLE_ASSIGNEES)
  const hiddenAssigneesCount = card.assignees.length - visibleAssignees.length
  const dueStatus = getDueDateStatus(card.dueDate)
  const progress = card.checklistProgress
  const isChecklistComplete = !!progress && progress.completed === progress.total
  const hasMeta = !!card.dueDate || !!progress || card.assignees.length > 0

  return (
    <>
      {card.labels.length > 0 && (
        <div className={classes.labels}>
          {card.labels.map((label) => (
            <LabelChip key={label.id} label={label} size="xs" />
          ))}
        </div>
      )}

      <div className={classes.header}>
        <p className={classes.title}>{card.title}</p>

        {onMoveToClick && (
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                className={classes.menu}
                aria-label={`Opciones de ${card.title}`}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
              <Menu.Item
                leftSection={<IconArrowsMove size={14} />}
                onClick={onMoveToClick}
              >
                Mover a...
              </Menu.Item>
              <Menu.Item
                leftSection={<IconArchive size={14} />}
                onClick={() => archiveMutation.mutate(card.id)}
              >
                Archivar tarjeta
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>

      {hasMeta && (
        <div className={classes.meta}>
          {card.dueDate && (
            <span
              className={[
                classes.due,
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
              className={[
                classes.checklist,
                isChecklistComplete && classes.checklistDone,
              ]
                .filter(Boolean)
                .join(' ')}
              title={`Checklist: ${progress.completed} de ${progress.total} completados`}
            >
              <IconChecklist size={12} />
              {progress.completed}/{progress.total}
            </span>
          )}

          {card.assignees.length > 0 && (
            <Avatar.Group spacing="xs" className={classes.assignees}>
              {visibleAssignees.map((assignee) => (
                <Tooltip key={assignee.id} label={assignee.name}>
                  <Avatar name={assignee.name} color="initials" radius="xl" size={20} />
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
      )}
    </>
  )
}
