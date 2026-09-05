import { Avatar, Progress, Table, Text, Tooltip } from '@mantine/core'
import type { Card } from '@/features/cards/types'
import { LabelChip } from '@/features/labels/components/label-chip'
import { TableDueDateCell } from './table-due-date-cell'
import { TableTitleCell } from './table-title-cell'
import classes from './board-table-view.module.css'

const MAX_VISIBLE_ASSIGNEES = 3
const MAX_VISIBLE_LABELS = 3

interface TableCardRowProps {
  card: Card
  listName: string
  onOpen: () => void
}

/** Una tarjeta como fila. La comparten la tabla plana y la agrupada (T12.3). */
export function TableCardRow({ card, listName, onOpen }: TableCardRowProps) {
  const visibleAssignees = card.assignees.slice(0, MAX_VISIBLE_ASSIGNEES)
  const hiddenAssignees = card.assignees.length - visibleAssignees.length
  const visibleLabels = card.labels.slice(0, MAX_VISIBLE_LABELS)
  const hiddenLabels = card.labels.length - visibleLabels.length
  const progress = card.checklistProgress

  return (
    <Table.Tr
      className={classes.row}
      tabIndex={0}
      aria-label={`Abrir tarjeta ${card.title}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <Table.Td className={classes.titleColumn}>
        <TableTitleCell card={card} />
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dimmed">
          {listName}
        </Text>
      </Table.Td>

      <Table.Td>
        {card.assignees.length === 0 ? (
          <span className={classes.empty}>—</span>
        ) : (
          <Avatar.Group spacing="xs">
            {visibleAssignees.map((assignee) => (
              <Tooltip key={assignee.id} label={assignee.name}>
                <Avatar
                  name={assignee.name}
                  color="initials"
                  radius="xl"
                  size={24}
                />
              </Tooltip>
            ))}
            {hiddenAssignees > 0 && (
              <Avatar radius="xl" size={24} color="gray">
                +{hiddenAssignees}
              </Avatar>
            )}
          </Avatar.Group>
        )}
      </Table.Td>

      <Table.Td>
        {card.labels.length === 0 ? (
          <span className={classes.empty}>—</span>
        ) : (
          <div className={classes.labels}>
            {visibleLabels.map((label) => (
              <LabelChip key={label.id} label={label} size="xs" />
            ))}
            {hiddenLabels > 0 && (
              <Text size="xs" c="dimmed">
                +{hiddenLabels}
              </Text>
            )}
          </div>
        )}
      </Table.Td>

      <Table.Td className={classes.dueColumn}>
        <TableDueDateCell card={card} />
      </Table.Td>

      <Table.Td>
        {progress ? (
          <div className={classes.progress}>
            <Text size="xs" c="dimmed" className={classes.progressCount}>
              {progress.completed}/{progress.total}
            </Text>
            <Progress
              value={
                progress.total === 0
                  ? 0
                  : (progress.completed / progress.total) * 100
              }
              size="sm"
              color={
                progress.completed === progress.total ? 'success' : 'primary'
              }
              className={classes.progressBar}
            />
          </div>
        ) : (
          <span className={classes.empty}>—</span>
        )}
      </Table.Td>
    </Table.Tr>
  )
}
