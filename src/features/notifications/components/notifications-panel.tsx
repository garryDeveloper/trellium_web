import {
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useNavigate } from 'react-router-dom'
import { NotificationRow } from './notification-row'
import { useNotifications } from '../hooks/use-notifications'
import { useMarkNotificationRead } from '../hooks/use-mark-notification-read'
import { useMarkAllNotificationsRead } from '../hooks/use-mark-all-notifications-read'
import { getNotificationLink } from '../utils/notification-text'
import type { AppNotification } from '../types'

interface NotificationsPanelProps {
  opened: boolean
  onClose: () => void
}

/**
 * Panel lateral y no una página aparte: `ui-guidelines.md` reserva la
 * navegación completa para el contenido, y las notificaciones tienen que ser
 * accesibles desde cualquier pantalla (`screens.md`).
 */
export function NotificationsPanel({
  opened,
  onClose,
}: NotificationsPanelProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const navigate = useNavigate()

  const notificationsQuery = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllMutation = useMarkAllNotificationsRead()

  const notifications = notificationsQuery.data?.notifications ?? []
  const unreadCount = notificationsQuery.data?.unreadCount ?? 0

  const open = (notification: AppNotification) => {
    // Abrir la marca leída y navega, en un solo gesto (T9.2).
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id)
    }

    const link = getNotificationLink(notification)
    if (link) {
      onClose()
      navigate(link)
    }
  }

  const resolveInvitation = (
    notification: AppNotification,
    action: 'accepted' | 'rejected',
  ) => {
    // Resolverla también la da por vista (T9.3).
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id)
    }
    // Aceptar navega al tablero recién unido, así que el panel estorba;
    // rechazar se queda en la lista para seguir revisando.
    if (action === 'accepted') {
      onClose()
    }
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title="Notificaciones"
      size={isMobile ? '100%' : 'md'}
    >
      <Stack gap="sm">
        {unreadCount > 0 && (
          <>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {unreadCount} sin leer
              </Text>
              <Button
                variant="subtle"
                size="xs"
                loading={markAllMutation.isPending}
                onClick={() => markAllMutation.mutate()}
              >
                Marcar todas como leídas
              </Button>
            </Group>
            <Divider />
          </>
        )}

        {notificationsQuery.isLoading && (
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        )}

        {!notificationsQuery.isLoading && notifications.length === 0 && (
          <Text size="sm" c="dimmed" py="md">
            No tenés notificaciones todavía. Te vamos a avisar cuando te asignen
            una tarjeta, comenten donde participás o te inviten a un tablero.
          </Text>
        )}

        <Stack gap={2}>
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onOpen={() => open(notification)}
              onResolveInvitation={(action) =>
                resolveInvitation(notification, action)
              }
            />
          ))}
        </Stack>
      </Stack>
    </Drawer>
  )
}
