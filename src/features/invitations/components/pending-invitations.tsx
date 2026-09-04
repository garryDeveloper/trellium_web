import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core'
import type { Invitation } from '../types'
import { useAcceptInvitation } from '../hooks/use-accept-invitation'
import { useRejectInvitation } from '../hooks/use-reject-invitation'

interface InvitationRowProps {
  invitation: Invitation
}

function InvitationRow({ invitation }: InvitationRowProps) {
  const acceptMutation = useAcceptInvitation()
  const rejectMutation = useRejectInvitation()

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" wrap="wrap" gap="sm">
        <Stack gap={2}>
          <Text fw={500}>{invitation.boardName}</Text>
          <Text size="xs" c="dimmed">
            Invitado por {invitation.invitedBy.name}
          </Text>
        </Stack>
        <Group gap="xs">
          <Button
            variant="default"
            size="xs"
            loading={rejectMutation.isPending}
            onClick={() => rejectMutation.mutate(invitation.id)}
          >
            Rechazar
          </Button>
          <Button
            size="xs"
            loading={acceptMutation.isPending}
            onClick={() => acceptMutation.mutate(invitation.id)}
          >
            Aceptar
          </Button>
        </Group>
      </Group>
    </Paper>
  )
}

interface PendingInvitationsProps {
  invitations: Invitation[]
}

export function PendingInvitations({ invitations }: PendingInvitationsProps) {
  if (invitations.length === 0) {
    return null
  }

  return (
    <Stack gap="sm">
      <Title order={2} size="h3">
        Invitaciones pendientes
      </Title>
      <Stack gap="xs">
        {invitations.map((invitation) => (
          <InvitationRow key={invitation.id} invitation={invitation} />
        ))}
      </Stack>
    </Stack>
  )
}
