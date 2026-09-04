import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CardTileBody } from './card-tile-body'
import type { Card } from '../types'
import classes from './card-tile.module.css'

interface CardTileProps {
  card: Card
  onOpen: () => void
  onMoveToClick: () => void
}

export function CardTile({ card, onOpen, onMoveToClick }: CardTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id, data: { type: 'card', listId: card.listId } })

  return (
    <div
      ref={setNodeRef}
      className={[classes.card, isDragging && classes.dragging]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Abrir tarjeta ${card.title}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <CardTileBody card={card} onMoveToClick={onMoveToClick} />
    </div>
  )
}
