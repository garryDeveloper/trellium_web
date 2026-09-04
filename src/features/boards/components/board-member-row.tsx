import { ActionIcon, Avatar, Badge, Group, Text, Tooltip } from '@mantine/core'
import { IconUserMinus } from '@tabler/icons-react'
import type { BoardMember } from '../types'

interface BoardMemberRowProps {
  member: BoardMember
  canRemove: boolean
  onRemove: () => void
  isRemoving: boolean
}

export function BoardMemberRow({
  member,
  canRemove,
  onRemove,
  isRemoving,
}: BoardMemberRowProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        <Avatar name={member.name} color="initials" radius="xl" size="sm" />
        <div style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} truncate>
            {member.name}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {member.email}
          </Text>
        </div>
      </Group>

      <Group gap="xs" wrap="nowrap">
        <Badge
          variant="light"
          color={member.role === 'owner' ? 'primary' : 'gray'}
          size="sm"
        >
          {member.role === 'owner' ? 'Propietario' : 'Miembro'}
        </Badge>
        {canRemove && (
          <Tooltip label="Remover del tablero">
            <ActionIcon
              variant="subtle"
              color="danger"
              size="sm"
              aria-label={`Remover a ${member.name} del tablero`}
              loading={isRemoving}
              onClick={onRemove}
            >
              <IconUserMinus size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Group>
  )
}
