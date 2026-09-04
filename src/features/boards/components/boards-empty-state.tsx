import { Button, Center, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconLayoutKanban, IconPlus } from '@tabler/icons-react'

interface BoardsEmptyStateProps {
  onCreate: () => void
}

export function BoardsEmptyState({ onCreate }: BoardsEmptyStateProps) {
  return (
    <Center py={80}>
      <Stack align="center" gap="sm" maw={360}>
        <ThemeIcon size={56} radius="xl" variant="light" color="primary">
          <IconLayoutKanban size={28} />
        </ThemeIcon>
        <Title order={2} size="h3" ta="center">
          Todavía no tenés tableros
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          Creá tu primer tablero para empezar a organizar el trabajo de tu
          equipo.
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={onCreate} mt="sm">
          Crear tu primer tablero
        </Button>
      </Stack>
    </Center>
  )
}
