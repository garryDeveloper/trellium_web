import { Center, Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconStack2 } from '@tabler/icons-react'
import { useMemo } from 'react'
import { useBoardFilter } from '@/features/boards/hooks/use-board-filter'
import { useBoardMembers } from '@/features/boards/hooks/use-board-members'
import { matchesBoardFilter } from '@/features/boards/utils/board-filter'
import { CardTileStatic } from '@/features/cards/components/card-tile-static'
import { useBoardCards } from '@/features/cards/hooks/use-board-cards'
import type { Card } from '@/features/cards/types'
import { LabelChip } from '@/features/labels/components/label-chip'
import { useBoardLabels } from '@/features/labels/hooks/use-board-labels'
import { useBoardLists } from '@/features/lists/hooks/use-board-lists'
import { buildCardGroups, type CardGrouping } from '../utils/card-groups'
import classes from './board-grouped-columns.module.css'

interface BoardGroupedColumnsProps {
  boardId: string
  grouping: CardGrouping
  onOpenCard: (card: Card) => void
}

/**
 * El tablero agrupado por algo que no es la lista (T12.3): una columna por
 * grupo, con su nombre y su cantidad.
 *
 * Es de sólo lectura a propósito. Sin drag-and-drop, sin reordenar columnas y
 * sin crear tarjetas: un grupo no es una lista, y soltar una tarjeta en
 * "Vencidas" o crear una en "Sin asignar" no tendría un significado único.
 * Todo eso vuelve al agrupar por lista.
 */
export function BoardGroupedColumns({
  boardId,
  grouping,
  onOpenCard,
}: BoardGroupedColumnsProps) {
  const listsQuery = useBoardLists(boardId, 'active')
  const lists = useMemo(() => listsQuery.data ?? [], [listsQuery.data])
  const { cardsByList, isLoading: isLoadingCards } = useBoardCards(lists)
  const membersQuery = useBoardMembers(boardId)
  const labelsQuery = useBoardLabels(boardId)
  const { filter, isActive: isFiltered } = useBoardFilter()

  const groups = useMemo(() => {
    // Las tarjetas entran en el orden del tablero (listas por posición,
    // tarjetas por su posición dentro de la lista), y así quedan dentro de cada
    // grupo: agrupar no reordena nada que el usuario no haya pedido.
    const cards = lists.flatMap((list) =>
      (cardsByList[list.id] ?? []).filter((card) =>
        matchesBoardFilter(card, filter),
      ),
    )
    return buildCardGroups(
      grouping,
      cards,
      membersQuery.data ?? [],
      labelsQuery.data ?? [],
    )
  }, [lists, cardsByList, filter, grouping, membersQuery.data, labelsQuery.data])

  if (listsQuery.isLoading || isLoadingCards) {
    return (
      <Center className={classes.state}>
        <Loader />
      </Center>
    )
  }

  if (groups.length === 0) {
    return (
      <Center className={classes.state}>
        <Stack align="center" gap="sm" maw={380}>
          <ThemeIcon size={48} radius="xl" variant="light" color="primary">
            <IconStack2 size={24} />
          </ThemeIcon>
          <Title order={2} size="h3" ta="center">
            {isFiltered
              ? 'Ninguna tarjeta coincide con el filtro'
              : 'Este tablero todavía no tiene tarjetas'}
          </Title>
          <Text c="dimmed" size="md" ta="center">
            {isFiltered
              ? 'El tablero no está vacío: hay un filtro activo. Limpialo para ver todas las tarjetas.'
              : 'Creá tarjetas agrupando por lista y vas a verlas acá repartidas en grupos.'}
          </Text>
        </Stack>
      </Center>
    )
  }

  return (
    <div className={classes.canvas}>
      {groups.map((group) => (
        <section
          key={group.key}
          className={classes.column}
          aria-label={`${group.name}: ${group.cards.length} ${group.cards.length === 1 ? 'tarjeta' : 'tarjetas'}`}
        >
          <header className={classes.header}>
            <span
              className={[classes.name, group.isEmptyBucket && classes.nameEmpty]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Agrupado por etiqueta, el encabezado es la etiqueta misma: el
                  color es cómo se la reconoce en la card. */}
              {group.label ? (
                <LabelChip label={group.label} size="sm" />
              ) : (
                group.name
              )}
            </span>
            <span className={classes.count}>{group.cards.length}</span>
          </header>

          <div className={classes.body}>
            {group.cards.map((card) => (
              <CardTileStatic
                key={card.id}
                card={card}
                onOpen={() => onOpenCard(card)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
