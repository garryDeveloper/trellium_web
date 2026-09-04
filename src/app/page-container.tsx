import { Container } from '@mantine/core'
import type { ReactNode } from 'react'

/**
 * Ancho de lectura de las pantallas normales. El board no lo usa: sangra a los
 * bordes del viewport para comportarse como una app y no como una página.
 */
export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Container size="xl" px={{ base: 'md', sm: 'xl' }} py="xl">
      {children}
    </Container>
  )
}
