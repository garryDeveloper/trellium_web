import { useDroppable } from '@dnd-kit/core'
import { UnstyledButton } from '@mantine/core'
import type { Card } from '@/features/cards/types'
import type { CalendarDay } from '../utils/calendar-month'
import { formatDayLabel } from '../utils/calendar-month'
import { CalendarCardChip } from './calendar-card-chip'
import classes from './board-calendar-view.module.css'

/**
 * Cuántas tarjetas muestra un día antes de plegar el resto detrás de un "+N".
 * Tres es lo que entra en la celda sin que la fila crezca; a partir de ahí, el
 * día se despliega a pedido.
 */
const MAX_VISIBLE_CARDS = 3

interface CalendarDayCellProps {
  day: CalendarDay
  cards: Card[]
  isExpanded: boolean
  onToggleExpanded: () => void
  onOpenCard: (card: Card) => void
}

export function CalendarDayCell({
  day,
  cards,
  isExpanded,
  onToggleExpanded,
  onOpenCard,
}: CalendarDayCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.key,
    data: { type: 'calendar-day', date: day.date },
  })

  const hiddenCount = cards.length - MAX_VISIBLE_CARDS
  const visibleCards =
    isExpanded || hiddenCount <= 0 ? cards : cards.slice(0, MAX_VISIBLE_CARDS)

  return (
    <div
      ref={setNodeRef}
      className={[
        classes.day,
        !day.isCurrentMonth && classes.dayOutside,
        day.isToday && classes.dayToday,
        isOver && classes.dayOver,
      ]
        .filter(Boolean)
        .join(' ')}
      /* Sin rol, el `aria-label` de un div no se anuncia: `group` es lo que
         hace que el lector diga de qué día son las tarjetas que sigue. */
      role="group"
      aria-label={`${formatDayLabel(day.date)}: ${cards.length} ${cards.length === 1 ? 'tarjeta' : 'tarjetas'}`}
    >
      <div className={classes.dayHeader}>
        <span className={classes.dayNumber}>{day.date.getDate()}</span>
        {day.isToday && <span className={classes.todayTag}>Hoy</span>}
      </div>

      <div className={classes.dayCards}>
        {visibleCards.map((card) => (
          <CalendarCardChip
            key={card.id}
            card={card}
            onOpen={() => onOpenCard(card)}
          />
        ))}

        {hiddenCount > 0 && (
          <UnstyledButton
            className={classes.moreButton}
            onClick={onToggleExpanded}
          >
            {isExpanded ? 'Ver menos' : `+${hiddenCount} más`}
          </UnstyledButton>
        )}
      </div>
    </div>
  )
}
