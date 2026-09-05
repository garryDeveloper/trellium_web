import { Button, Text } from '@mantine/core'
import { IconLayoutColumns, IconStack2 } from '@tabler/icons-react'
import { BOARD_GROUP_BY_LABEL, type BoardView } from '../types'
import type { CardGrouping } from '../utils/card-groups'
import classes from './board-grouping-notice.module.css'

interface BoardGroupingNoticeProps {
  grouping: CardGrouping
  view: BoardView
  /** Cuántas tarjetas aparecen en más de un grupo; 0 si ninguna. */
  multiGroupCount: number
  onGroupByList: () => void
}

/**
 * Mientras el tablero no esté agrupado por lista, lo dice — igual que la barra
 * de filtro dice que hay filtro puesto. Acá hay dos cosas que el usuario no
 * puede deducir mirando: por qué no puede arrastrar, y por qué los contadores
 * de los grupos suman más que las tarjetas del tablero.
 */
export function BoardGroupingNotice({
  grouping,
  view,
  multiGroupCount,
  onGroupByList,
}: BoardGroupingNoticeProps) {
  const facet = grouping === 'assignee' ? 'varios miembros' : 'varias etiquetas'

  const sentences = [
    `Agrupado por ${BOARD_GROUP_BY_LABEL[grouping].toLowerCase()}: es otra lectura del mismo tablero, ninguna tarjeta cambió de lista ni de posición.`,
    view === 'board' &&
      'El arrastre está deshabilitado porque mover una tarjeta entre grupos sería ambiguo.',
    multiGroupCount > 0 &&
      `${multiGroupCount} ${multiGroupCount === 1 ? 'tarjeta aparece' : 'tarjetas aparecen'} en más de un grupo, porque ${multiGroupCount === 1 ? 'tiene' : 'tienen'} ${facet}.`,
  ].filter(Boolean)

  return (
    <div className={classes.bar} role="status">
      <IconStack2 size={16} className={classes.icon} />
      <Text size="sm" c="dimmed" className={classes.text}>
        {sentences.join(' ')}
      </Text>
      <Button
        variant="subtle"
        color="gray"
        size="compact-sm"
        leftSection={<IconLayoutColumns size={14} />}
        onClick={onGroupByList}
      >
        Agrupar por lista
      </Button>
    </div>
  )
}
