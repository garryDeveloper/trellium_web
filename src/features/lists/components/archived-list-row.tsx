import { ActionIcon, Group, Text, Tooltip } from '@mantine/core'
import { IconRestore, IconTrash } from '@tabler/icons-react'
import type { List } from '../types'

interface ArchivedListRowProps {
  list: List
  onRestore: () => void
  isRestoring: boolean
  onDeleteClick: () => void
}

export function ArchivedListRow({
  list,
  onRestore,
  isRestoring,
  onDeleteClick,
}: ArchivedListRowProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text size="sm" fw={500} truncate style={{ minWidth: 0 }}>
        {list.name}
      </Text>
      <Group gap="xs" wrap="nowrap">
        <Tooltip label="Restaurar">
          <ActionIcon
            variant="subtle"
            color="primary"
            size="sm"
            loading={isRestoring}
            onClick={onRestore}
            aria-label={`Restaurar ${list.name}`}
          >
            <IconRestore size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Eliminar definitivamente">
          <ActionIcon
            variant="subtle"
            color="danger"
            size="sm"
            onClick={onDeleteClick}
            aria-label={`Eliminar ${list.name} definitivamente`}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  )
}
