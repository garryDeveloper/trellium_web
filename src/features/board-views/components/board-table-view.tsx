import {
  Center,
  Loader,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core'
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronUp,
  IconTable,
} from '@tabler/icons-react'
import { Fragment, useMemo } from 'react'
import { useBoardFilter } from '@/features/boards/hooks/use-board-filter'
import { useBoardMembers } from '@/features/boards/hooks/use-board-members'
import { useBoardCards } from '@/features/cards/hooks/use-board-cards'
import type { Card } from '@/features/cards/types'
import { LabelChip } from '@/features/labels/components/label-chip'
import { useBoardLabels } from '@/features/labels/hooks/use-board-labels'
import { useBoardLists } from '@/features/lists/hooks/use-board-lists'
import { useTableSort } from '../hooks/use-table-sort'
import type { TableSort, TableSortColumn } from '../types'
import { buildCardGroups, type CardGrouping } from '../utils/card-groups'
import { buildTableRows, sortTableRows } from '../utils/table-rows'
import { TableCardRow } from './table-card-row'
import classes from './board-table-view.module.css'

const COLUMN_COUNT = 6

interface BoardTableViewProps {
  boardId: string
  /** `null` es la tabla plana: una fila por tarjeta, sin encabezados de grupo. */
  grouping: CardGrouping | null
  onOpenCard: (card: Card) => void
}

interface SortableHeaderProps {
  column: TableSortColumn
  label: string
  sort: TableSort | null
  onSort: (column: TableSortColumn) => void
}

function SortableHeader({ column, label, sort, onSort }: SortableHeaderProps) {
  const isActive = sort?.column === column
  const direction = isActive ? sort.direction : null

  return (
    <Table.Th
      // El estado del orden lo lee el lector de pantalla del encabezado, no del
      // icono: el icono es su duplicado visual.
      aria-sort={
        direction === 'asc'
          ? 'ascending'
          : direction === 'desc'
            ? 'descending'
            : 'none'
      }
    >
      <UnstyledButton
        className={classes.sortButton}
        onClick={() => onSort(column)}
      >
        <span>{label}</span>
        {direction === 'asc' && <IconChevronUp size={14} />}
        {direction === 'desc' && <IconChevronDown size={14} />}
        {!direction && (
          <IconArrowsSort size={14} className={classes.sortHint} />
        )}
      </UnstyledButton>
    </Table.Th>
  )
}

/**
 * Vista Tabla (T12.1): una fila por tarjeta activa del tablero, con sus
 * atributos en columnas comparables.
 *
 * Es una proyección de los mismos datos que ya tiene en cache la vista Tablero
 * — mismas queries de listas y tarjetas —, así que cambiar de vista no dispara
 * red y editar acá se refleja allá sin trabajo extra.
 */
export function BoardTableView({
  boardId,
  grouping,
  onOpenCard,
}: BoardTableViewProps) {
  const listsQuery = useBoardLists(boardId, 'active')
  const lists = useMemo(() => listsQuery.data ?? [], [listsQuery.data])
  const { cardsByList, isLoading: isLoadingCards } = useBoardCards(lists)
  const membersQuery = useBoardMembers(boardId)
  const labelsQuery = useBoardLabels(boardId)
  const { filter, isActive: isFiltered } = useBoardFilter()
  const { sort, toggleSort } = useTableSort()

  const rows = useMemo(
    () => sortTableRows(buildTableRows(lists, cardsByList, filter), sort),
    [lists, cardsByList, filter, sort],
  )

  /*
    Los grupos se arman sobre las filas YA ordenadas, así que el orden elegido
    sigue valiendo dentro de cada grupo. La columna "Lista" no cambia al
    agrupar: es un atributo de la tarjeta, y agrupar no la mueve de lista
    (`domain.md`, reglas 3 y 4).
  */
  const groups = useMemo(
    () =>
      grouping
        ? buildCardGroups(
            grouping,
            rows.map((row) => row.card),
            membersQuery.data ?? [],
            labelsQuery.data ?? [],
          )
        : null,
    [grouping, rows, membersQuery.data, labelsQuery.data],
  )

  // Agrupar por miembro o etiqueta repite tarjetas, así que el nombre de la
  // lista se busca por id en vez de arrastrarlo dentro del grupo.
  const listNameByCardId = useMemo(
    () => new Map(rows.map((row) => [row.card.id, row.listName])),
    [rows],
  )

  if (listsQuery.isLoading || isLoadingCards) {
    return (
      <Center className={classes.state}>
        <Loader />
      </Center>
    )
  }

  return (
    <div className={classes.shell}>
      <Table.ScrollContainer
        minWidth={860}
        type="native"
        className={classes.scroll}
      >
        <Table
          highlightOnHover
          stickyHeader
          verticalSpacing="xs"
          className={classes.table}
        >
          <Table.Thead>
            <Table.Tr>
              <SortableHeader
                column="title"
                label="Título"
                sort={sort}
                onSort={toggleSort}
              />
              <SortableHeader
                column="list"
                label="Lista"
                sort={sort}
                onSort={toggleSort}
              />
              <SortableHeader
                column="assignees"
                label="Miembros"
                sort={sort}
                onSort={toggleSort}
              />
              <SortableHeader
                column="labels"
                label="Etiquetas"
                sort={sort}
                onSort={toggleSort}
              />
              <SortableHeader
                column="dueDate"
                label="Fecha límite"
                sort={sort}
                onSort={toggleSort}
              />
              <SortableHeader
                column="progress"
                label="Checklist"
                sort={sort}
                onSort={toggleSort}
              />
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {groups
              ? groups.map((group) => (
                  <Fragment key={group.key}>
                    <Table.Tr className={classes.groupRow}>
                      <Table.Th colSpan={COLUMN_COUNT} scope="colgroup">
                        <span className={classes.groupHeader}>
                          {group.label ? (
                            <LabelChip label={group.label} size="xs" />
                          ) : (
                            <span
                              className={
                                group.isEmptyBucket
                                  ? classes.groupNameEmpty
                                  : undefined
                              }
                            >
                              {group.name}
                            </span>
                          )}
                          <span className={classes.groupCount}>
                            {group.cards.length}
                          </span>
                        </span>
                      </Table.Th>
                    </Table.Tr>

                    {group.cards.map((card) => (
                      <TableCardRow
                        key={`${group.key}:${card.id}`}
                        card={card}
                        listName={listNameByCardId.get(card.id) ?? ''}
                        onOpen={() => onOpenCard(card)}
                      />
                    ))}
                  </Fragment>
                ))
              : rows.map((row) => (
                  <TableCardRow
                    key={row.card.id}
                    card={row.card}
                    listName={row.listName}
                    onOpen={() => onOpenCard(row.card)}
                  />
                ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {rows.length === 0 && (
        <Center className={classes.state}>
          <Stack align="center" gap="sm" maw={380}>
            <ThemeIcon size={48} radius="xl" variant="light" color="primary">
              <IconTable size={24} />
            </ThemeIcon>
            <Title order={2} size="h3" ta="center">
              {isFiltered
                ? 'Ninguna tarjeta coincide con el filtro'
                : 'Este tablero todavía no tiene tarjetas'}
            </Title>
            <Text c="dimmed" size="md" ta="center">
              {isFiltered
                ? 'El tablero no está vacío: hay un filtro activo. Limpialo para ver todas las tarjetas.'
                : 'Creá tarjetas desde la vista Tablero y vas a verlas acá, una por fila.'}
            </Text>
          </Stack>
        </Center>
      )}
    </div>
  )
}
