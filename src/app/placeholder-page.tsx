import { Center, Stack, Text, Title } from '@mantine/core'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Center h="100vh">
      <Stack align="center" gap="xs">
        <Title order={1}>{title}</Title>
        <Text c="dimmed">{description}</Text>
      </Stack>
    </Center>
  )
}
