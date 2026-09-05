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
import { IconBell, IconChecklist, IconLogout } from '@tabler/icons-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { BrandMark } from './brand-mark'
import { CommandPalette } from './command-palette'
import { ColorSchemeToggle } from './color-scheme-toggle'
import { GlobalSearch } from '@/features/search/components/global-search'
import { NotificationsPanel } from '@/features/notifications/components/notifications-panel'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'
import { MY_WORK_ROUTE } from '@/features/board-views/route'
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

          {/* "Mi trabajo" es una pantalla transversal, al mismo nivel que Mis
              tableros (T12.4): por eso está en el header y no dentro de un
              tablero. La marca ya es el enlace a Mis tableros. */}
          <NavLink
            to={MY_WORK_ROUTE}
            className={({ isActive }) =>
              [classes.navLink, isActive && classes.navLinkActive]
                .filter(Boolean)
                .join(' ')
            }
          >
            <IconChecklist size={16} />
            <span className={classes.navLinkLabel}>Mi trabajo</span>
          </NavLink>

          <GlobalSearch />

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

      {/* La paleta abre el panel de notificaciones, que lo controla este
          layout: por eso recibe el handler en vez de tener el suyo. */}
      <CommandPalette onOpenNotifications={openNotifications} />
    </AppShell>
  )
}
