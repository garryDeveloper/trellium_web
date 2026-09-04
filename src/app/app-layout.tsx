import {
  ActionIcon,
  AppShell,
  Avatar,
  Group,
  Indicator,
  Menu,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBell, IconLogout } from '@tabler/icons-react'
import { Link, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { BrandMark } from './brand-mark'
import { ColorSchemeToggle } from './color-scheme-toggle'
import { NotificationsPanel } from '@/features/notifications/components/notifications-panel'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'
import classes from './app-layout.module.css'

export function AppLayout() {
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogout()
  const [notificationsOpened, { open: openNotifications, close: closeNotifications }] =
    useDisclosure(false)
  const notificationsQuery = useNotifications()
  const unreadCount = notificationsQuery.data?.unreadCount ?? 0

  return (
    <AppShell header={{ height: 56 }} padding={0}>
      <AppShell.Header className={classes.header}>
        <div className={classes.headerInner}>
          <UnstyledButton
            component={Link}
            to="/"
            className={classes.brand}
            aria-label="Trellium — ir a Mis tableros"
          >
            <span className={classes.brandIcon}>
              <BrandMark />
            </span>
            <span className={classes.brandName}>Trellium</span>
          </UnstyledButton>

          <Group gap={4} wrap="nowrap">
            <ColorSchemeToggle />

            <Tooltip label="Notificaciones">
              <Indicator
                disabled={unreadCount === 0}
                label={unreadCount > 9 ? '9+' : unreadCount}
                size={16}
                offset={6}
                color="primary"
              >
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  aria-label={
                    unreadCount > 0
                      ? `Notificaciones, ${unreadCount} sin leer`
                      : 'Notificaciones'
                  }
                  onClick={openNotifications}
                >
                  <IconBell size={18} />
                </ActionIcon>
              </Indicator>
            </Tooltip>

            <Menu width={220} position="bottom-end">
              <Menu.Target>
                <UnstyledButton aria-label="Cuenta">
                  <Avatar name={user?.name} color="initials" radius="xl" size={30} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user?.name}</Menu.Label>
                <Menu.Item disabled>{user?.email}</Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="danger"
                  leftSection={<IconLogout size={16} />}
                  onClick={() => logoutMutation.mutate()}
                >
                  Cerrar sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <NotificationsPanel
        opened={notificationsOpened}
        onClose={closeNotifications}
      />
    </AppShell>
  )
}
