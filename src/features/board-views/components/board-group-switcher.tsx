import { Button, Menu } from '@mantine/core'
import {
  IconCalendarEvent,
  IconCheck,
  IconLayoutColumns,
  IconTag,
  IconUser,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { BOARD_GROUP_BY_LABEL, BOARD_GROUP_BYS, type BoardGroupBy } from '../types'
import classes from './board-group-switcher.module.css'

const GROUP_BY_ICON: Record<BoardGroupBy, ReactNode> = {
  list: <IconLayoutColumns size={14} />,
  assignee: <IconUser size={14} />,
  label: <IconTag size={14} />,
  due_date: <IconCalendarEvent size={14} />,
}

interface BoardGroupSwitcherProps {
  groupBy: BoardGroupBy
  onChange: (groupBy: BoardGroupBy) => void
}

/**
 * La agrupación es un menú y no un segmentado como el selector de vista: son
 * cuatro opciones con nombres largos y se cambian mucho menos seguido que la
 * vista. El botón dice cuál está puesta, para no tener que abrirlo para saberlo.
 */
export function BoardGroupSwitcher({
  groupBy,
  onChange,
}: BoardGroupSwitcherProps) {
  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <Button
          variant={groupBy === 'list' ? 'subtle' : 'light'}
          color={groupBy === 'list' ? 'gray' : 'primary'}
          leftSection={GROUP_BY_ICON[groupBy]}
        >
          Agrupar
          <span className={classes.value}>
            : {BOARD_GROUP_BY_LABEL[groupBy]}
          </span>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Agrupar tarjetas por</Menu.Label>
        {BOARD_GROUP_BYS.map((option) => (
          <Menu.Item
            key={option}
            leftSection={GROUP_BY_ICON[option]}
            rightSection={
              option === groupBy ? <IconCheck size={14} /> : undefined
            }
            onClick={() => onChange(option)}
          >
            {BOARD_GROUP_BY_LABEL[option]}
            {option === 'list' && ' (default)'}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
