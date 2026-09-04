import { Badge, Group, Paper, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import type { BoardListItem } from '../types'

interface BoardCardProps {
  board: BoardListItem
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Paper
      component={Link}
      to={`/boards/${board.id}`}
      withBorder
      p="lg"
      radius="md"
      className="board-card"
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <Stack gap="xs">
        <Text fw={500} c="var(--mantine-color-text)" truncate>
          {board.name}
        </Text>
        <Group gap={6}>
          <Badge
            variant="light"
            color={board.role === 'owner' ? 'primary' : 'gray'}
            size="sm"
          >
            {board.role === 'owner' ? 'Propietario' : 'Miembro'}
          </Badge>
          <Text size="xs" c="dimmed">
            {board.memberCount} {board.memberCount === 1 ? 'miembro' : 'miembros'}
          </Text>
        </Group>
      </Stack>
    </Paper>
  )
}
