import {
  Avatar,
  Center,
  Loader,
  Progress,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronUp,
  IconTable,
} from '@tabler/icons-react'
import { useMemo } from 'react'
import { useBoardFilter } from '@/features/boards/hooks/use-board-filter'
import { useBoardCards } from '@/features/cards/hooks/use-board-cards'
import type { Card } from '@/features/cards/types'
import { LabelChip } from '@/features/labels/components/label-chip'
import { useBoardLists } from '@/features/lists/hooks/use-board-lists'
import { useTableSort } from '../hooks/use-table-sort'
import type { TableSort, TableSortColumn } from '../types'
import { buildTableRows, sortTableRows } from '../utils/table-rows'
import { TableDueDateCell } from './table-due-date-cell'
import { TableTitleCell } from './table-title-cell'
import classes from './board-table-view.module.css'

const MAX_VISIBLE_ASSIGNEES = 3
const MAX_VISIBLE_LABELS = 3

interface BoardTableViewProps {
  boardId: string
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
export function BoardTableView({ boardId, onOpenCard }: BoardTableViewProps) {
  const listsQuery = useBoardLists(boardId, 'active')
  const lists = useMemo(() => listsQuery.data ?? [], [listsQuery.data])
  const { cardsByList, isLoading: isLoadingCards } = useBoardCards(lists)
  const { filter, isActive: isFiltered } = useBoardFilter()
  const { sort, toggleSort } = useTableSort()

  const rows = useMemo(
    () => sortTableRows(buildTableRows(lists, cardsByList, filter), sort),
    [lists, cardsByList, filter, sort],
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
            {rows.map(({ card, listName }) => {
              const visibleAssignees = card.assignees.slice(
                0,
                MAX_VISIBLE_ASSIGNEES,
              )
              const hiddenAssignees =
                card.assignees.length - visibleAssignees.length
              const visibleLabels = card.labels.slice(0, MAX_VISIBLE_LABELS)
              const hiddenLabels = card.labels.length - visibleLabels.length
              const progress = card.checklistProgress

              return (
                <Table.Tr
                  key={card.id}
                  className={classes.row}
                  tabIndex={0}
                  aria-label={`Abrir tarjeta ${card.title}`}
                  onClick={() => onOpenCard(card)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onOpenCard(card)
                    }
                  }}
                >
                  <Table.Td className={classes.titleColumn}>
                    <TableTitleCell card={card} />
                  </Table.Td>

                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {listName}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    {card.assignees.length === 0 ? (
                      <span className={classes.empty}>—</span>
                    ) : (
                      <Avatar.Group spacing="xs">
                        {visibleAssignees.map((assignee) => (
                          <Tooltip key={assignee.id} label={assignee.name}>
                            <Avatar
                              name={assignee.name}
                              color="initials"
                              radius="xl"
                              size={24}
                            />
                          </Tooltip>
                        ))}
                        {hiddenAssignees > 0 && (
                          <Avatar radius="xl" size={24} color="gray">
                            +{hiddenAssignees}
                          </Avatar>
                        )}
                      </Avatar.Group>
                    )}
                  </Table.Td>

                  <Table.Td>
                    {card.labels.length === 0 ? (
                      <span className={classes.empty}>—</span>
                    ) : (
                      <div className={classes.labels}>
                        {visibleLabels.map((label) => (
                          <LabelChip key={label.id} label={label} size="xs" />
                        ))}
                        {hiddenLabels > 0 && (
                          <Text size="xs" c="dimmed">
                            +{hiddenLabels}
                          </Text>
                        )}
                      </div>
                    )}
                  </Table.Td>

                  <Table.Td className={classes.dueColumn}>
                    <TableDueDateCell card={card} />
                  </Table.Td>

                  <Table.Td>
                    {progress ? (
                      <div className={classes.progress}>
                        <Text size="xs" c="dimmed" className={classes.progressCount}>
                          {progress.completed}/{progress.total}
                        </Text>
                        <Progress
                          value={
                            progress.total === 0
                              ? 0
                              : (progress.completed / progress.total) * 100
                          }
                          size="sm"
                          color={
                            progress.completed === progress.total
                              ? 'success'
                              : 'primary'
                          }
                          className={classes.progressBar}
                        />
                      </div>
                    ) : (
                      <span className={classes.empty}>—</span>
                    )}
                  </Table.Td>
                </Table.Tr>
              )
            })}
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
