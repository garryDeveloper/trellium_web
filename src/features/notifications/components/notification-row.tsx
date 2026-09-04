import { Text, Tooltip, UnstyledButton } from '@mantine/core'
import { useMyInvitations } from '@/features/invitations/hooks/use-my-invitations'
import {
  formatAbsoluteDate,
  formatRelativeDate,
} from '@/shared/utils/relative-time'
import { NotificationInvitationActions } from './notification-invitation-actions'
import {
  AVAILABILITY_NOTICE,
  getNotificationText,
} from '../utils/notification-text'
import type { AppNotification } from '../types'
import classes from './notification-row.module.css'

interface NotificationRowProps {
  notification: AppNotification
  onOpen: () => void
  onResolveInvitation: (action: 'accepted' | 'rejected') => void
}

export function NotificationRow({
  notification,
  onOpen,
  onResolveInvitation,
}: NotificationRowProps) {
  const text = getNotificationText(notification)
  const isInvitation = notification.type === 'board_invited'

  // React Query comparte esta consulta con el resto del panel, así que no
  // agrega un request por fila.
  const invitationsQuery = useMyInvitations()
  const pendingInvitation = isInvitation
    ? invitationsQuery.data?.find(
        (invitation) => invitation.boardId === notification.boardId,
      )
    : undefined

  /*
   * Una invitación sin resolver siempre viene con `no_access`: todavía no sos
   * miembro del tablero. Avisar "ya no tenés acceso" ahí sería mentir, así que
   * para las invitaciones ese aviso se omite y solo queda el de contenido
   * eliminado.
   */
  const unavailableNotice =
    notification.availability === 'deleted'
      ? AVAILABILITY_NOTICE.deleted
      : notification.availability === 'no_access' && !isInvitation
        ? AVAILABILITY_NOTICE.no_access
        : null

  const canNavigate = notification.availability === 'available'

  const body = (
    <>
      {notification.isRead ? (
        <span className={classes.readSpacer} />
      ) : (
        <span className={classes.unreadDot} aria-hidden />
      )}

      <div className={classes.content}>
        <Text
          size="sm"
          fw={notification.isRead ? 400 : 600}
          className={classes.text}
        >
          {text}
        </Text>

        {unavailableNotice && (
          <Text size="xs" c="dimmed" mt={2}>
            {unavailableNotice}
          </Text>
        )}

        <Tooltip label={formatAbsoluteDate(notification.createdAt)}>
          <Text size="xs" c="dimmed" mt={2} component="span">
            {formatRelativeDate(notification.createdAt)}
          </Text>
        </Tooltip>

        {isInvitation && (
          <div
            style={{ marginTop: 8 }}
            // Las acciones viven dentro de la fila, así que su clic no debe
            // disparar también la navegación de la fila.
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <NotificationInvitationActions
              notification={notification}
              pendingInvitation={pendingInvitation}
              isLoading={invitationsQuery.isLoading}
              onResolved={onResolveInvitation}
            />
          </div>
        )}
      </div>
    </>
  )

  const readLabel = notification.isRead ? 'leída' : 'no leída'

  // Sin destino no hay botón: una fila "clickeable" que no hace nada es peor
  // que una fila que se ve inerte.
  if (!canNavigate) {
    return (
      <div className={classes.row} aria-label={`${text} — ${readLabel}`}>
        {body}
      </div>
    )
  }

  return (
    <UnstyledButton
      className={`${classes.row} ${classes.clickable}`}
      aria-label={`${text} — ${readLabel}`}
      onClick={onOpen}
    >
      {body}
    </UnstyledButton>
  )
}
