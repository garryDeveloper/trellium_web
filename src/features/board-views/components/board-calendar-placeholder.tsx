import { Center, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconCalendarMonth } from '@tabler/icons-react'
import classes from './board-table-view.module.css'

/**
 * La vista Calendario es T12.2. El selector ya ofrece las tres opciones
 * (criterio de T12.1), así que la tercera tiene que llevar a algún lado: mejor
 * decir que todavía no está que dejar una opción muerta que no cambia nada.
 */
export function BoardCalendarPlaceholder() {
  return (
    <Center className={classes.state}>
      <Stack align="center" gap="sm" maw={380}>
        <ThemeIcon size={48} radius="xl" variant="light" color="primary">
          <IconCalendarMonth size={24} />
        </ThemeIcon>
        <Title order={2} size="h3" ta="center">
          La vista Calendario todavía no está lista
        </Title>
        <Text c="dimmed" size="md" ta="center">
          Vas a poder ver las tarjetas en su día de vencimiento y mover la fecha
          arrastrándolas. Mientras tanto, usá Tablero o Tabla.
        </Text>
      </Stack>
    </Center>
  )
}
