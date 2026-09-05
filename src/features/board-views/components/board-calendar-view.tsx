import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useBoardFilter } from '@/features/boards/hooks/use-board-filter'
import { matchesBoardFilter } from '@/features/boards/utils/board-filter'
import { useBoardCards } from '@/features/cards/hooks/use-board-cards'
import type { Card } from '@/features/cards/types'
import { useBoardLists } from '@/features/lists/hooks/use-board-lists'
import { useCalendarMonth } from '../hooks/use-calendar-month'
import { useRescheduleCard } from '../hooks/use-reschedule-card'
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  formatMonthTitle,
  groupCardsByDay,
  moveDueDateToDay,
  toDayKey,
} from '../utils/calendar-month'
import { CalendarCardDragPreview } from './calendar-card-chip'
import { CalendarDayCell } from './calendar-day-cell'
import classes from './board-calendar-view.module.css'

interface BoardCalendarViewProps {
  boardId: string
  onOpenCard: (card: Card) => void
}

function cardsWord(count: number): string {
  return count === 1 ? 'tarjeta' : 'tarjetas'
}

/**
 * Vista Calendario (T12.2): las tarjetas con fecha límite sobre el mes, y el
 * arrastre a otro día como forma de replanificar sin abrir tarjeta por tarjeta.
 *
 * Como la vista Tabla, es una proyección de las mismas queries que ya tiene en
 * cache la vista Tablero: cambiar de vista no dispara red, y mover una fecha
 * acá se ve en las otras dos.
 */
export function BoardCalendarView({
  boardId,
  onOpenCard,
}: BoardCalendarViewProps) {
  const listsQuery = useBoardLists(boardId, 'active')
  const lists = useMemo(() => listsQuery.data ?? [], [listsQuery.data])
  const { cardsByList, isLoading: isLoadingCards } = useBoardCards(lists)
  const { filter, isActive: isFiltered } = useBoardFilter()
  const {
    month,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  } = useCalendarMonth()

  const rescheduleMutation = useRescheduleCard()
  const [draggedCard, setDraggedCard] = useState<Card | null>(null)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

  const visibleCards = useMemo(
    () =>
      Object.values(cardsByList)
        .flat()
        .filter((card) => matchesBoardFilter(card, filter)),
    [cardsByList, filter],
  )

  const scheduledCards = useMemo(
    () => visibleCards.filter((card) => card.dueDate),
    [visibleCards],
  )
  const cardsByDay = useMemo(
    () => groupCardsByDay(scheduledCards),
    [scheduledCards],
  )
  const days = useMemo(() => buildMonthGrid(month), [month])

  // Lo que el calendario no muestra hay que decirlo: si no, un tablero de 40
  // tarjetas con 3 fechas parece un tablero de 3 tarjetas.
  const undatedCount = visibleCards.length - scheduledCards.length
  const inGridCount = days.reduce(
    (total, day) => total + (cardsByDay[day.key]?.length ?? 0),
    0,
  )
  const outsideMonthCount = scheduledCards.length - inGridCount

  const sensors = useSensors(
    // Igual que en el tablero: 4px de umbral para que el clic que abre la
    // tarjeta no se confunda con el arrastre que le cambia la fecha.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  )

  const toggleExpandedDay = (key: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (!next.delete(key)) next.add(key)
      return next
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const card = event.active.data.current?.card as Card | undefined
    setDraggedCard(card ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedCard(null)

    const { active, over } = event
    if (!over || over.data.current?.type !== 'calendar-day') return

    const card = active.data.current?.card as Card | undefined
    if (!card?.dueDate) return

    const day = over.data.current?.date as Date
    // Soltar en el mismo día no es un cambio: pedirle al servidor que escriba
    // la fecha que ya tiene sólo dispararía un toast que confunde.
    if (toDayKey(new Date(card.dueDate)) === toDayKey(day)) return

    rescheduleMutation.mutate({
      card,
      dueDate: moveDueDateToDay(card.dueDate, day),
    })
  }

  /*
    El vacío del calendario tiene tres causas distintas y conviene no
    confundirlas: no hay tarjetas que pasen el filtro, las que pasan no tienen
    fecha, o el tablero todavía no tiene ninguna fecha límite.
  */
  const emptyStateBody = !isFiltered
    ? 'El calendario muestra cada tarjeta en su día de vencimiento. Ponele fecha límite a una tarjeta y va a aparecer acá.'
    : visibleCards.length === 0
      ? 'El filtro no deja pasar ninguna tarjeta. Limpialo para ver el mes completo.'
      : `${visibleCards.length === 1 ? 'La única tarjeta que pasa el filtro no tiene' : `Las ${visibleCards.length} tarjetas que pasan el filtro no tienen`} fecha límite, y el calendario sólo muestra las que la tienen.`

  if (listsQuery.isLoading || isLoadingCards) {
    return (
      <Center className={classes.state}>
        <Loader />
      </Center>
    )
  }

  return (
    <div className={classes.shell}>
      <header className={classes.header}>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="default"
            aria-label="Mes anterior"
            onClick={goToPreviousMonth}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            aria-label="Mes siguiente"
            onClick={goToNextMonth}
          >
            <IconChevronRight size={16} />
          </ActionIcon>
          <Button
            size="compact-sm"
            variant="default"
            onClick={goToToday}
            disabled={isCurrentMonth}
          >
            Hoy
          </Button>
          <Title order={2} size="h4" className={classes.monthTitle}>
            {formatMonthTitle(month)}
          </Title>
        </Group>

        {scheduledCards.length > 0 &&
          (undatedCount > 0 || outsideMonthCount > 0) && (
            <Text size="xs" c="dimmed">
              {[
                undatedCount > 0 &&
                  `${undatedCount} ${cardsWord(undatedCount)} sin fecha límite`,
                outsideMonthCount > 0 &&
                  `${outsideMonthCount} con fecha en otro mes`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          )}
      </header>

      {scheduledCards.length === 0 ? (
        <Center className={classes.state}>
          <Stack align="center" gap="sm" maw={420}>
            <ThemeIcon size={48} radius="xl" variant="light" color="primary">
              <IconCalendarMonth size={24} />
            </ThemeIcon>
            <Title order={2} size="h3" ta="center">
              {isFiltered
                ? 'Ninguna tarjeta con fecha coincide con el filtro'
                : 'Todavía no hay tarjetas con fecha límite'}
            </Title>
            <Text c="dimmed" size="md" ta="center">
              {emptyStateBody}
            </Text>
          </Stack>
        </Center>
      ) : (
        <DndContext
          sensors={sensors}
          /* `pointerWithin` y no la detección por rectángulos del tablero: la
             copia que sigue al cursor es más ancha que una celda y siempre pisa
             dos días, así que el día que vale es el que está bajo el puntero. */
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setDraggedCard(null)}
        >
          {/* Los encabezados van DENTRO del contenedor que scrollea: si
              quedaran afuera, al scrollear la grilla en horizontal las columnas
              se moverían debajo del día equivocado. */}
          <div className={classes.gridScroll}>
            <div className={classes.weekdays}>
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className={classes.weekday}>
                  {label}
                </span>
              ))}
            </div>

            <div className={classes.grid}>
              {days.map((day) => (
                <CalendarDayCell
                  key={day.key}
                  day={day}
                  cards={cardsByDay[day.key] ?? []}
                  isExpanded={expandedDays.has(day.key)}
                  onToggleExpanded={() => toggleExpandedDay(day.key)}
                  onOpenCard={onOpenCard}
                />
              ))}
            </div>
          </div>

          {/* Misma razón que en el tablero: la copia vive en un portal, así que
              no la recorta el overflow de la celda ni el de la grilla. */}
          <DragOverlay dropAnimation={null}>
            {draggedCard && <CalendarCardDragPreview card={draggedCard} />}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
