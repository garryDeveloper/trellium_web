import { SegmentedControl, Tooltip } from '@mantine/core'
import {
  IconCalendarMonth,
  IconLayoutColumns,
  IconTable,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import type { BoardView } from '../types'
import classes from './board-view-switcher.module.css'

interface BoardViewSwitcherProps {
  view: BoardView
  onChange: (view: BoardView) => void
}

function Option({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Tooltip label={label} openDelay={400}>
      <span className={classes.option}>
        {icon}
        <span className={classes.label}>{label}</span>
      </span>
    </Tooltip>
  )
}

/**
 * Las tres vistas del tablero son la misma información mirada de otra forma,
 * así que el selector es un segmentado y no un menú: las opciones están a la
 * vista y se alterna entre ellas de un clic.
 */
export function BoardViewSwitcher({ view, onChange }: BoardViewSwitcherProps) {
  return (
    <SegmentedControl
      size="xs"
      value={view}
      onChange={(value) => onChange(value as BoardView)}
      aria-label="Vista del tablero"
      className={classes.control}
      data={[
        {
          value: 'board',
          label: <Option icon={<IconLayoutColumns size={16} />} label="Tablero" />,
        },
        {
          value: 'table',
          label: <Option icon={<IconTable size={16} />} label="Tabla" />,
        },
        {
          value: 'calendar',
          label: (
            <Option icon={<IconCalendarMonth size={16} />} label="Calendario" />
          ),
        },
      ]}
    />
  )
}
