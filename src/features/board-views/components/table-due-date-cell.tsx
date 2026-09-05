import { ActionIcon, Badge, Button, Group, TextInput, Tooltip } from '@mantine/core'
import { IconCalendarPlus, IconPencil, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useUpdateCard } from '@/features/cards/hooks/use-update-card'
import type { Card } from '@/features/cards/types'
import {
  DUE_DATE_STATUS_COLOR,
  DUE_DATE_STATUS_LABEL,
  formatDueDate,
  fromDateTimeLocalValue,
  getDueDateStatus,
  toDateTimeLocalValue,
} from '@/features/cards/utils/due-date'
import classes from './board-table-view.module.css'

interface TableDueDateCellProps {
  card: Card
}

/** La fecha límite se edita en la fila (T12.1), con el mismo control que el detalle. */
export function TableDueDateCell({ card }: TableDueDateCellProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const updateMutation = useUpdateCard(card.listId)
  const status = getDueDateStatus(card.dueDate)

  const openEditor = () => {
    setValue(card.dueDate ? toDateTimeLocalValue(card.dueDate) : '')
    setEditing(true)
  }

  const submit = () => {
    if (!value) {
      setEditing(false)
      return
    }
    updateMutation.mutate(
      { cardId: card.id, dueDate: fromDateTimeLocalValue(value) },
      { onSuccess: () => setEditing(false) },
    )
  }

  const clear = () => {
    updateMutation.mutate(
      { cardId: card.id, dueDate: null },
      { onSuccess: () => setEditing(false) },
    )
  }

  if (editing) {
    return (
      <Group
        gap={4}
        wrap="nowrap"
        onClick={(event) => event.stopPropagation()}
      >
        <TextInput
          type="datetime-local"
          size="xs"
          autoFocus
          value={value}
          aria-label={`Fecha límite de ${card.title}`}
          onChange={(event) => setValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit()
            if (event.key === 'Escape') setEditing(false)
          }}
        />
        <Button
          size="compact-xs"
          onClick={submit}
          loading={updateMutation.isPending}
        >
          Guardar
        </Button>
        <Button
          size="compact-xs"
          variant="default"
          onClick={() => setEditing(false)}
        >
          Cancelar
        </Button>
        {card.dueDate && (
          <Tooltip label="Quitar fecha límite">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label={`Quitar fecha límite de ${card.title}`}
              loading={updateMutation.isPending}
              onClick={clear}
            >
              <IconX size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    )
  }

  return (
    <Group gap={4} wrap="nowrap">
      {card.dueDate ? (
        <Badge
          variant="light"
          size="sm"
          color={DUE_DATE_STATUS_COLOR[status]}
          title={DUE_DATE_STATUS_LABEL[status]}
        >
          {formatDueDate(card.dueDate)}
        </Badge>
      ) : (
        <span className={classes.empty}>—</span>
      )}
      <ActionIcon
        variant="subtle"
        color="gray"
        size="sm"
        className={classes.rowAction}
        aria-label={
          card.dueDate
            ? `Cambiar fecha límite de ${card.title}`
            : `Definir fecha límite de ${card.title}`
        }
        onClick={(event) => {
          event.stopPropagation()
          openEditor()
        }}
      >
        {card.dueDate ? <IconPencil size={14} /> : <IconCalendarPlus size={14} />}
      </ActionIcon>
    </Group>
  )
}
