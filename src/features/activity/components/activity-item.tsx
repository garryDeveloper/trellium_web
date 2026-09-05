import { Text, Tooltip } from '@mantine/core'
import {
  IconArchive,
  IconArrowsMove,
  IconCalendarEvent,
  IconCalendarOff,
  IconFileText,
  IconPaperclip,
  IconPencil,
  IconPlus,
  IconRestore,
  IconTag,
  IconUserMinus,
  IconUserPlus,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import {
  formatAbsoluteDate,
  formatRelativeDate,
} from '@/shared/utils/relative-time'
import { ActivityDescription } from './activity-description'
import type { Activity } from '../types'
import classes from './activity-item.module.css'

const ACTIVITY_ICON: Record<string, ReactNode> = {
  card_created: <IconPlus size={13} />,
  card_moved: <IconArrowsMove size={13} />,
  card_renamed: <IconPencil size={13} />,
  card_described: <IconFileText size={13} />,
  card_archived: <IconArchive size={13} />,
  card_unarchived: <IconRestore size={13} />,
  assignee_added: <IconUserPlus size={13} />,
  assignee_removed: <IconUserMinus size={13} />,
  label_applied: <IconTag size={13} />,
  label_removed: <IconTag size={13} />,
  due_date_set: <IconCalendarEvent size={13} />,
  due_date_cleared: <IconCalendarOff size={13} />,
  attachment_added: <IconPaperclip size={13} />,
  attachment_removed: <IconPaperclip size={13} />,
}

interface ActivityItemProps {
  activity: Activity
  /** Id del usuario actual, para redactar en primera persona. */
  currentUserId: string | undefined
}

/**
 * Un evento del historial. Comparte la grilla del comentario —gutter, nombre,
 * fecha relativa— pero en lugar del avatar lleva un ícono apagado: los eventos
 * son el fondo de la conversación, no la conversación.
 *
 * Es de sólo lectura por definición: no hay editar ni borrar (`domain.md`, 17).
 */
export function ActivityItem({ activity, currentUserId }: ActivityItemProps) {
  const actorName = activity.actor?.name ?? 'Alguien'
  const isSelfAction =
    activity.type === 'assignee_added' || activity.type === 'assignee_removed'
      ? activity.payload.memberName === actorName
      : false

  return (
    <div className={classes.item}>
      <span className={classes.icon} aria-hidden="true">
        {ACTIVITY_ICON[activity.type] ?? <IconPencil size={13} />}
      </span>

      <Text size="sm" c="dimmed" className={classes.text}>
        <span className={classes.actor}>
          {currentUserId && activity.actor?.id === currentUserId
            ? 'Vos'
            : actorName}
        </span>{' '}
        <ActivityDescription activity={activity} isSelfAction={isSelfAction} />{' '}
        <Tooltip label={formatAbsoluteDate(activity.createdAt)} openDelay={300}>
          <time className={classes.date} dateTime={activity.createdAt}>
            {formatRelativeDate(activity.createdAt)}
          </time>
        </Tooltip>
      </Text>
    </div>
  )
}
