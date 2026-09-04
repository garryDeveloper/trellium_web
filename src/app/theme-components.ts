import {
  ActionIcon,
  Badge,
  Button,
  Menu,
  Modal,
  Paper,
  Tooltip,
} from '@mantine/core'
import classes from './theme-components.module.css'

/**
 * Defaults de componente: una decisión por componente en vez de repetirla en cada
 * call site. Todo lo que se pase explícitamente en el call site sigue ganando.
 */
export const components = {
  // Las acciones primarias van en tinta, no en el color de acento.
  Button: Button.extend({
    defaultProps: { color: 'ink' },
    classNames: { root: classes.button },
  }),

  ActionIcon: ActionIcon.extend({
    defaultProps: { radius: 'sm' },
  }),

  Paper: Paper.extend({
    defaultProps: { radius: 'md' },
    styles: { root: { '--paper-border-color': 'var(--tr-border-default)' } },
  }),

  Badge: Badge.extend({
    defaultProps: { radius: 'sm' },
  }),

  Menu: Menu.extend({
    defaultProps: { radius: 'lg', shadow: 'lg' },
  }),

  Modal: Modal.extend({
    defaultProps: { radius: 'xl', centered: true },
  }),

  Tooltip: Tooltip.extend({
    defaultProps: { radius: 'sm', openDelay: 400 },
    classNames: { tooltip: classes.tooltip },
  }),
}
