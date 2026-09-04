import { ActionIcon, Badge, Button, Group, Stack, TextInput } from '@mantine/core'
import { IconCalendarEvent, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useUpdateCard } from '../hooks/use-update-card'
import type { Card } from '../types'
import {
  DUE_DATE_STATUS_COLOR,
  DUE_DATE_STATUS_LABEL,
  formatDueDate,
  fromDateTimeLocalValue,
  getDueDateStatus,
  toDateTimeLocalValue,
} from '../utils/due-date'

interface CardDueDateEditorProps {
  card: Card
}

export function CardDueDateEditor({ card }: CardDueDateEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(() =>
    card.dueDate ? toDateTimeLocalValue(card.dueDate) : '',
  )
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

  return (
    <Stack gap={4}>
      {editing ? (
        <Group gap="xs" align="center" wrap="wrap">
          <TextInput
            type="datetime-local"
            size="sm"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            autoFocus
          />
          <Button size="xs" onClick={submit} loading={updateMutation.isPending}>
            Guardar
          </Button>
          <Button size="xs" variant="default" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
          {card.dueDate && (
            <Button
              size="xs"
              variant="subtle"
              color="danger"
              onClick={clear}
              loading={updateMutation.isPending}
            >
              Quitar fecha
            </Button>
          )}
        </Group>
      ) : (
        <Group gap="xs">
          <Badge
            variant="light"
            color={DUE_DATE_STATUS_COLOR[status]}
            leftSection={<IconCalendarEvent size={12} />}
          >
            {card.dueDate
              ? `${formatDueDate(card.dueDate)} · ${DUE_DATE_STATUS_LABEL[status]}`
              : DUE_DATE_STATUS_LABEL.none}
          </Badge>
          <Button size="xs" variant="subtle" onClick={openEditor}>
            {card.dueDate ? 'Cambiar' : 'Definir fecha límite'}
          </Button>
          {card.dueDate && (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label="Quitar fecha límite"
              loading={updateMutation.isPending}
              onClick={clear}
            >
              <IconX size={14} />
            </ActionIcon>
          )}
        </Group>
      )}
    </Stack>
  )
}
