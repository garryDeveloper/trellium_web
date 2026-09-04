import { ActionIcon, Group, Text, Tooltip } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import type { BoardInvitation } from '../types'

interface BoardInvitationRowProps {
  invitation: BoardInvitation
  onCancel: () => void
  isCancelling: boolean
}

export function BoardInvitationRow({
  invitation,
  onCancel,
  isCancelling,
}: BoardInvitationRowProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <div style={{ minWidth: 0 }}>
        <Text size="sm" fw={500} truncate>
          {invitation.invitedEmail}
        </Text>
        <Text size="xs" c="dimmed">
          Invitación pendiente
        </Text>
      </div>

      <Tooltip label="Cancelar invitación">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          aria-label={`Cancelar invitación a ${invitation.invitedEmail}`}
          loading={isCancelling}
          onClick={onCancel}
        >
          <IconX size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}
