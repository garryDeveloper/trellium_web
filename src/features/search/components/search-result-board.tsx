import { Badge, Group, Text } from '@mantine/core'
import { IconLayoutKanban } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import type { Board } from '@/features/boards/types'
import classes from './search-result-card.module.css'

interface SearchResultBoardProps {
  board: Board
}

/** Un tablero encontrado por su nombre. Misma fila que un resultado de tarjeta. */
export function SearchResultBoard({ board }: SearchResultBoardProps) {
  return (
    <Link
      to={`/boards/${board.id}`}
      className={classes.row}
      aria-label={`Tablero ${board.name}`}
    >
      <Group gap="xs" wrap="nowrap">
        {/* Trazo fino: a 18px el contorno de 2px del icono se empasta y deja
            de leerse como un tablero. */}
        <IconLayoutKanban size={18} stroke={1.5} style={{ flexShrink: 0 }} />
        <Text size="md" fw={500} truncate>
          {board.name}
        </Text>
        {board.status === 'archived' && (
          <Badge color="gray" variant="light" size="xs">
            Archivado
          </Badge>
        )}
      </Group>
    </Link>
  )
}
