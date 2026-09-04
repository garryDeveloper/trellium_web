import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { IconFilter } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { LabelChip } from '@/features/labels/components/label-chip'
import type { Label } from '@/features/labels/types'
import {
  DUE_DATE_STATUS_LABEL,
  type DueDateStatus,
} from '@/features/cards/utils/due-date'
import type { BoardMember } from '../types'
import { FILTER_NONE } from '../types'
import type { useBoardFilter } from '../hooks/use-board-filter'
import classes from './board-filter-popover.module.css'

/** Orden de urgencia descendente: lo que está en rojo primero. */
const DUE_OPTIONS: DueDateStatus[] = ['overdue', 'due-soon', 'on-time', 'none']

interface BoardFilterPopoverProps {
  members: BoardMember[]
  labels: Label[]
  filter: ReturnType<typeof useBoardFilter>
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap={6}>
      <Text size="xs" fw={500} c="dimmed">
        {title}
      </Text>
      {children}
    </Stack>
  )
}

export function BoardFilterPopover({
  members,
  labels,
  filter,
}: BoardFilterPopoverProps) {
  const {
    filter: value,
    activeCount,
    isActive,
    toggleMember,
    toggleLabel,
    toggleDue,
    setText,
    clear,
  } = filter

  return (
    <Popover position="bottom-end" withinPortal shadow="md">
      <Popover.Target>
        <Button
          variant={isActive ? 'light' : 'subtle'}
          color={isActive ? 'primary' : 'gray'}
          leftSection={<IconFilter size={16} />}
          aria-label={
            isActive
              ? `Filtros (${activeCount} activos)`
              : 'Filtrar tarjetas del tablero'
          }
        >
          Filtros
          {activeCount > 0 && (
            <span className={classes.count}>{activeCount}</span>
          )}
        </Button>
      </Popover.Target>

      <Popover.Dropdown w={280}>
        <Stack gap="md">
          <Section title="Texto">
            <TextInput
              size="sm"
              placeholder="Título o descripción..."
              aria-label="Filtrar por texto en título o descripción"
              value={value.text}
              onChange={(event) => setText(event.currentTarget.value)}
            />
          </Section>

          <Divider />

          <Section title="Miembro asignado">
            <ScrollArea.Autosize mah={140} type="auto">
              <Stack gap={6}>
                <Checkbox
                  size="xs"
                  label="Sin miembro asignado"
                  checked={value.memberIds.includes(FILTER_NONE)}
                  onChange={() => toggleMember(FILTER_NONE)}
                />
                {members.map((member) => (
                  <Checkbox
                    key={member.userId}
                    size="xs"
                    label={member.name}
                    checked={value.memberIds.includes(member.userId)}
                    onChange={() => toggleMember(member.userId)}
                  />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          </Section>

          <Divider />

          <Section title="Etiqueta">
            <ScrollArea.Autosize mah={140} type="auto">
              <Stack gap={6}>
                <Checkbox
                  size="xs"
                  label="Sin etiqueta"
                  checked={value.labelIds.includes(FILTER_NONE)}
                  onChange={() => toggleLabel(FILTER_NONE)}
                />
                {labels.map((label) => (
                  <Checkbox
                    key={label.id}
                    size="xs"
                    checked={value.labelIds.includes(label.id)}
                    onChange={() => toggleLabel(label.id)}
                    label={<LabelChip label={label} size="xs" />}
                  />
                ))}
                {labels.length === 0 && (
                  <Text size="xs" c="dimmed">
                    Este tablero todavía no tiene etiquetas.
                  </Text>
                )}
              </Stack>
            </ScrollArea.Autosize>
          </Section>

          <Divider />

          <Section title="Vencimiento">
            <Stack gap={6}>
              {DUE_OPTIONS.map((due) => (
                <Checkbox
                  key={due}
                  size="xs"
                  label={DUE_DATE_STATUS_LABEL[due]}
                  checked={value.due.includes(due)}
                  onChange={() => toggleDue(due)}
                />
              ))}
            </Stack>
          </Section>

          {isActive && (
            <>
              <Divider />
              <Group justify="flex-end">
                <Anchor component="button" type="button" size="xs" onClick={clear}>
                  Limpiar filtros
                </Anchor>
              </Group>
            </>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
