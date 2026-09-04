import {
  createTheme,
  rem,
  virtualColor,
  type MantineColorsTuple,
} from '@mantine/core'
import { components } from './theme-components'

/**
 * Neutros cálidos — la tupla maestra del sistema.
 *
 * Mantine deriva de `gray` una decena de variables internas: el borde de
 * `Paper withBorder` y de `AppShell.Header`, `c="dimmed"`, los placeholders, los
 * estados disabled y los hovers de `variant="default"`. Reemplazarla acá es lo
 * que convierte toda la app de gris frío (#dee2e6) a papel cálido de una sola vez.
 */
const gray: MantineColorsTuple = [
  '#FAF9F7', // 0 · canvas
  '#F2F0EC', // 1 · superficie hundida (columnas del board)
  '#EDEBE7', // 2 · hover / borde sutil
  '#E2DFD9', // 3 · borde por defecto → Paper withBorder, AppShell.Header
  '#CDC9C1', // 4 · borde fuerte → inputs (default-border)
  '#A3A09A', // 5 · texto terciario → placeholder, disabled
  '#6E6B65', // 6 · texto secundario → dimmed
  '#4A4843', // 7
  '#302E2B', // 8
  '#1F1E1C', // 9 · texto principal
]

/**
 * Ciruela — el color de firma de Trellium.
 *
 * Se registra como `primary` para que Mantine lo use en el anillo de foco y en
 * los estados activos sin trabajo extra (y para no romper los `color="primary"`
 * que ya existen en el código). Regla del sistema: marca, foco, estado activo,
 * enlaces y selección. **Nunca botones primarios** — esos van en tinta.
 */
const primary: MantineColorsTuple = [
  '#FBF4F8',
  '#F4E8F0',
  '#E8D2DF',
  '#D6B2C8',
  '#C08FAF',
  '#9A6389',
  '#6B2D5C', // 6 · acento
  '#5C2750',
  '#4B2043',
  '#3A1935',
]

/**
 * Tinta cálida — las acciones primarias.
 *
 * El índice 7 es más claro que el 6 a propósito: Mantine usa `shade + 1` como
 * hover del `variant="filled"`, y un near-black no puede oscurecerse al hover.
 */
const inkLight: MantineColorsTuple = [
  '#F7F6F5',
  '#EDEBE9',
  '#DAD7D3',
  '#BEBAB4',
  '#97938C',
  '#5C5954',
  '#1F1E1C', // 6 · relleno del botón primario
  '#302E2B', // 7 · hover: aclara, no oscurece
  '#151412',
  '#0D0C0B',
]

/**
 * Neutro oscuro cálido — la contraparte de `gray` en modo oscuro.
 *
 * Mantine deriva de `dark` las superficies del esquema oscuro igual que deriva
 * de `gray` las del claro: `dark[7]` es el fondo del body, `dark[6]` la
 * superficie de `variant="default"`, `dark[4]` los bordes, `dark[2]` el texto
 * `dimmed` y `dark[0]` el texto principal. Es marrón-neutro, no azulado: la
 * `dark` que trae Mantine es fría y chocaría con el papel cálido del modo claro.
 */
const dark: MantineColorsTuple = [
  '#F2F0EC', // 0 · texto principal
  '#DAD7D1', // 1
  '#A8A49C', // 2 · texto secundario → dimmed
  '#807C74', // 3 · placeholder / disabled
  '#403D39', // 4 · borde por defecto
  '#33302C', // 5 · hover de variant="default"
  '#26241F', // 6 · superficie elevada
  '#1C1A18', // 7 · fondo del body
  '#141311', // 8 · superficie hundida
  '#0D0C0B', // 9
]

/**
 * Tinta invertida — las acciones primarias en modo oscuro.
 *
 * La regla del sistema es "acciones primarias en tinta, no en el acento". Su
 * traducción al modo oscuro no es un botón oscuro (sería invisible sobre el
 * fondo) sino el negativo: papel sobre tinta. Los índices que importan son los
 * que Mantine deriva de `primaryShade.dark` (4): el 4 es el relleno y el 5 su
 * hover, que acá oscurece porque un near-white no puede aclararse.
 */
const inkDark: MantineColorsTuple = [
  '#FFFFFF', // 0 · borde de variant="outline", texto de variant="light"
  '#FAF9F7',
  '#F5F3EF',
  '#F2F0EC',
  '#EDEBE7', // 4 · relleno del botón primario
  '#DAD7D1', // 5 · hover
  '#C4C0B9',
  '#B0ACA4',
  '#97938C',
  '#7A756E',
]

/**
 * Semánticos. Corridos una posición respecto de las escalas Tailwind para que el
 * índice 6 contenga el hex de `ui-guidelines.md`: `primaryShade: 6` aplica a
 * TODOS los colores, no solo al primario, así que antes `color="danger"`
 * renderizaba #DC2626 en vez del #B91C1C especificado.
 */
const success: MantineColorsTuple = [
  '#DCFCE7',
  '#BBF7D0',
  '#86EFAC',
  '#4ADE80',
  '#22C55E',
  '#16A34A',
  '#15803D', // 6 · color-success
  '#166534',
  '#14532D',
  '#052E16',
]

const warning: MantineColorsTuple = [
  '#FEF3C7',
  '#FDE68A',
  '#FCD34D',
  '#FBBF24',
  '#F59E0B',
  '#D97706',
  '#B45309', // 6 · color-warning
  '#92400E',
  '#78350F',
  '#451A03',
]

const danger: MantineColorsTuple = [
  '#FEE2E2',
  '#FECACA',
  '#FCA5A5',
  '#F87171',
  '#EF4444',
  '#DC2626',
  '#B91C1C', // 6 · color-danger
  '#991B1B',
  '#7F1D1D',
  '#450A0A',
]

const info: MantineColorsTuple = [
  '#DBEAFE',
  '#BFDBFE',
  '#93C5FD',
  '#60A5FA',
  '#3B82F6',
  '#2563EB',
  '#1D4ED8', // 6 · color-info
  '#1E40AF',
  '#1E3A8A',
  '#172554',
]

export const theme = createTheme({
  primaryColor: 'primary',
  // Objeto y no número: el shade 6 del ciruela está calculado para contrastar
  // contra papel y sobre fondo oscuro se hunde — el anillo de foco quedaba en
  // 1.6:1, por debajo del 3:1 que pide ui-guidelines.md. El 4 lo devuelve a
  // 6.4:1 y de paso alinea `--mantine-primary-color-filled` con `--tr-accent`.
  primaryShade: { light: 6, dark: 4 },
  colors: {
    gray,
    dark,
    primary,
    inkLight,
    inkDark,
    // `color="ink"` resuelve a una tupla u otra según el esquema, sin que
    // ningún call site tenga que saber en cuál está.
    ink: virtualColor({ name: 'ink', light: 'inkLight', dark: 'inkDark' }),
    success,
    warning,
    danger,
    info,
  },

  // Necesario para la tinta invertida: sin esto Mantine pinta el texto de
  // `variant="filled"` siempre en blanco, y el botón primario del modo oscuro
  // (relleno claro) quedaría ilegible. Calcula blanco o negro según la
  // luminancia real del relleno, así que el modo claro no cambia.
  autoContrast: true,

  // `black` alimenta --mantine-color-text: el texto cálido sale gratis en toda
  // la app. `white` queda como superficie elevada.
  black: '#1F1E1C',
  white: '#FFFFFF',

  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  // `size` en Text setea tamaño Y interlineado, así que las claves van pareadas.
  fontSizes: {
    xs: rem(12), // caption
    sm: rem(13), // meta
    md: rem(14), // body
    lg: rem(17), // title-md
    xl: rem(22), // title-lg
  },
  lineHeights: {
    xs: '1.3333', // 16/12
    sm: '1.3846', // 18/13
    md: '1.5', // 21/14
    lg: '1.4118', // 24/17
    xl: '1.2727', // 28/22
  },

  // 600 es el techo del sistema: Inter está cargada en 400/500/600 y el 700 en
  // UI lee "web", no "producto".
  headings: {
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(28), lineHeight: '1.2143' }, // display
      h2: { fontSize: rem(22), lineHeight: '1.2727' }, // title-lg
      h3: { fontSize: rem(17), lineHeight: '1.4118' }, // title-md
      h4: { fontSize: rem(15), lineHeight: '1.3333' }, // title-sm
      h5: { fontSize: rem(14), lineHeight: '1.5' },
      h6: { fontSize: rem(13), lineHeight: '1.3846' },
    },
  },

  radius: {
    xs: rem(4),
    sm: rem(6), // botones, inputs, badges
    md: rem(8), // cards
    lg: rem(10), // columnas, dropdowns
    xl: rem(14), // diálogos
  },
  defaultRadius: 'sm',

  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },

  // Sombras tintadas en cálido: el negro puro sobre papel cálido embarra.
  shadows: {
    xs: '0 1px 2px rgba(31, 30, 28, 0.05)',
    sm: '0 1px 3px rgba(31, 30, 28, 0.07), 0 1px 2px rgba(31, 30, 28, 0.04)',
    md: '0 4px 12px rgba(31, 30, 28, 0.08), 0 1px 3px rgba(31, 30, 28, 0.05)',
    lg: '0 12px 32px rgba(31, 30, 28, 0.12), 0 4px 8px rgba(31, 30, 28, 0.06)',
    xl: '0 16px 32px rgba(31, 30, 28, 0.18), 0 4px 8px rgba(31, 30, 28, 0.10)',
  },

  components,
})
