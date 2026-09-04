import { Badge, Button, Group } from '@mantine/core'
import { useAcceptInvitation } from '@/features/invitations/hooks/use-accept-invitation'
import { useRejectInvitation } from '@/features/invitations/hooks/use-reject-invitation'
import type { Invitation } from '@/features/invitations/types'
import type { AppNotification } from '../types'

interface NotificationInvitationActionsProps {
  notification: AppNotification
  /** La invitación pendiente de ese tablero, si todavía no se resolvió. */
  pendingInvitation: Invitation | undefined
  isLoading: boolean
  onResolved: (action: 'accepted' | 'rejected') => void
}

/**
 * T9.3: resolver la invitación desde la notificación tiene que dar el mismo
 * resultado que resolverla en "Mis tableros", así que reusa las mismas
 * mutaciones y no endpoints propios.
 */
export function NotificationInvitationActions({
  notification,
  pendingInvitation,
  isLoading,
  onResolved,
}: NotificationInvitationActionsProps) {
  const acceptMutation = useAcceptInvitation()
  const rejectMutation = useRejectInvitation()

  if (!pendingInvitation) {
    if (isLoading) {
      return null
    }

    /*
     * Ya resuelta. La API no guarda el desenlace en la notificación, así que se
     * deduce de si el usuario quedó como miembro: con acceso la aceptó, sin
     * acceso la rechazó.
     */
    return (
      <Badge
        size="sm"
        variant="light"
        color={notification.availability === 'available' ? 'success' : 'gray'}
      >
        {notification.availability === 'available' ? 'Aceptada' : 'Rechazada'}
      </Badge>
    )
  }

  return (
    <Group gap="xs">
      <Button
        variant="default"
        size="xs"
        loading={rejectMutation.isPending}
        onClick={() =>
          rejectMutation.mutate(pendingInvitation.id, {
            onSuccess: () => onResolved('rejected'),
          })
        }
      >
        Rechazar
      </Button>
      <Button
        size="xs"
        loading={acceptMutation.isPending}
        onClick={() =>
          acceptMutation.mutate(pendingInvitation.id, {
            onSuccess: () => onResolved('accepted'),
          })
        }
      >
        Aceptar
      </Button>
    </Group>
  )
}
