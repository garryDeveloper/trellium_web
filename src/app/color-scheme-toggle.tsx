import {
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

/**
 * El estado vive en Mantine (persistido en `localStorage`), no en un store
 * propio: es el mismo valor que lee el script de arranque en `index.html`.
 *
 * `colorScheme` puede ser `auto`; `useComputedColorScheme` lo resuelve contra
 * la preferencia del sistema para que el primer click siempre haga lo contrario
 * de lo que se está viendo, y no lo contrario de un `auto` que no se ve.
 */
export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computed = useComputedColorScheme('light', {
    getInitialValueInEffect: false,
  })
  const isDark = computed === 'dark'
  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <Tooltip label={label}>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        aria-label={label}
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
      >
        {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  )
}
