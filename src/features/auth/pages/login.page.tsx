import { Anchor, Center, Paper, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/login-form'

export function LoginPage() {
  return (
    <Center h="100vh" px="md">
      <Paper withBorder p="xl" radius="lg" w={400} shadow="sm">
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={1} size="h2">
              Iniciar sesión
            </Title>
            <Text c="dimmed" size="sm">
              Accedé a tus tableros.
            </Text>
          </Stack>

          <LoginForm />

          <Text size="sm" c="dimmed" ta="center">
            ¿No tenés cuenta?{' '}
            <Anchor component={Link} to="/register" size="sm">
              Registrate
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  )
}
