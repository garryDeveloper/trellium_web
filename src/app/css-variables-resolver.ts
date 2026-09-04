import type { CSSVariablesResolver } from '@mantine/core'

/**
 * Capa de tokens semánticos del sistema (`--tr-*`).
 *
 * El prefijo es `tr-` (Trellium) y no `app-` a propósito: Mantine ya usa
 * `--app-shell-*` para sus internals de AppShell, y mezclarlos invita a
 * confundir tokens del sistema con variables del framework.
 *
 * Los componentes consumen SIEMPRE estas variables, nunca hex sueltos ni
 * `theme.other`. Cada token existe en los dos esquemas con el mismo nombre, así
 * que agregar modo oscuro fue completar el mapa `dark` — ni un componente tocado.
 */
export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  // Independientes del esquema de color: geometría y movimiento.
  variables: {
    '--tr-column-width': '288px',
    '--tr-board-toolbar-height': '56px',
    '--tr-motion-fast': '120ms',
    '--tr-motion-base': '160ms',
    '--tr-motion-ease': 'cubic-bezier(0.2, 0, 0.2, 1)',
    // La paleta de etiquetas es pastel por definición: el texto encima siempre
    // es oscuro, también en modo oscuro.
    '--tr-label-text': '#1F1E1C',
  },

  light: {
    '--tr-surface-canvas': theme.colors.gray[0],
    '--tr-surface-sunken': theme.colors.gray[1],
    '--tr-surface-raised': theme.white,
    '--tr-surface-hover': theme.colors.gray[2],
    '--tr-surface-active': theme.colors.gray[3],
    '--tr-surface-inverse': '#2A2825',

    '--tr-border-subtle': theme.colors.gray[2],
    '--tr-border-default': theme.colors.gray[3],
    '--tr-border-strong': theme.colors.gray[4],

    '--tr-text-primary': theme.colors.gray[9],
    '--tr-text-secondary': theme.colors.gray[6],
    '--tr-text-tertiary': theme.colors.gray[5],
    '--tr-text-on-inverse': theme.colors.gray[0],

    '--tr-accent': theme.colors.primary[6],
    '--tr-accent-hover': theme.colors.primary[7],
    '--tr-accent-subtle': theme.colors.primary[1],
    '--tr-accent-border': theme.colors.primary[2],

    // Estados semánticos: el shade 6 es el hex exacto de ui-guidelines.md.
    '--tr-status-success': theme.colors.success[6],
    '--tr-status-warning': theme.colors.warning[6],
    '--tr-status-danger': theme.colors.danger[6],
  },

  /**
   * El oscuro no es el claro invertido punto por punto: se conserva el ORDEN de
   * elevación (hundido < canvas < elevado) invirtiendo la luminancia, que es lo
   * que hace que las columnas del tablero sigan leyéndose como huecos y las
   * tarjetas como piezas apoyadas encima.
   */
  dark: {
    '--tr-surface-canvas': theme.colors.dark[7],
    '--tr-surface-sunken': theme.colors.dark[8],
    '--tr-surface-raised': theme.colors.dark[6],
    '--tr-surface-hover': theme.colors.dark[5],
    '--tr-surface-active': theme.colors.dark[4],
    // "Inverso" sigue queriendo decir "lo contrario del fondo": acá, claro.
    '--tr-surface-inverse': theme.colors.dark[0],

    '--tr-border-subtle': theme.colors.dark[5],
    '--tr-border-default': theme.colors.dark[4],
    '--tr-border-strong': '#565149',

    '--tr-text-primary': theme.colors.dark[0],
    '--tr-text-secondary': theme.colors.dark[2],
    '--tr-text-tertiary': theme.colors.dark[3],
    '--tr-text-on-inverse': theme.colors.dark[9],

    // El ciruela del acento es demasiado oscuro sobre fondo oscuro: sube de
    // shade para mantener el contraste del anillo de foco y los enlaces.
    '--tr-accent': theme.colors.primary[4],
    '--tr-accent-hover': theme.colors.primary[3],
    '--tr-accent-subtle': theme.colors.primary[9],
    '--tr-accent-border': theme.colors.primary[7],

    // Los shade 6 son colores pensados para contrastar contra papel; sobre
    // fondo oscuro se hunden. Los estados suben de shade.
    '--tr-status-success': theme.colors.success[3],
    '--tr-status-warning': theme.colors.warning[3],
    '--tr-status-danger': theme.colors.danger[3],

    /**
     * Único caso donde se pisa una variable de Mantine en vez de definir una
     * `--tr-*`: `default-border` delimita CONTROLES (inputs, `variant="default"`),
     * no contenedores, así que le aplica el 3:1 de ui-guidelines.md. El
     * `dark[4]` que Mantine usaría queda en 1.44:1. Los bordes de contenedor
     * siguen en `--tr-border-*`, que son decorativos y pesan menos a propósito.
     */
    '--mantine-color-default-border': '#78736A',

    /**
     * Las sombras del tema son tinta cálida al 5-18% — calibradas para papel.
     * Sobre fondo oscuro no se ven, y los menús y modales quedaban flotando sin
     * despegue. Acá se rehacen en negro y con más opacidad, que es como se
     * consigue elevación en oscuro.
     */
    '--mantine-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.30)',
    '--mantine-shadow-sm':
      '0 1px 3px rgba(0, 0, 0, 0.40), 0 1px 2px rgba(0, 0, 0, 0.30)',
    '--mantine-shadow-md':
      '0 4px 12px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.35)',
    '--mantine-shadow-lg':
      '0 12px 32px rgba(0, 0, 0, 0.55), 0 4px 8px rgba(0, 0, 0, 0.40)',
    '--mantine-shadow-xl':
      '0 16px 32px rgba(0, 0, 0, 0.65), 0 4px 8px rgba(0, 0, 0, 0.45)',
  },
})
