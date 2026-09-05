import { CardTileBody } from './card-tile-body'
import type { Card } from '../types'
import classes from './card-tile.module.css'

interface CardTileStaticProps {
  card: Card
  onOpen: () => void
}

/**
 * La misma card del tablero, sin drag-and-drop ni menú de opciones: la usa la
 * vista agrupada (T12.3), donde arrastrar entre grupos sería ambiguo y "Mover
 * a..." hablaría de listas que la columna ya no representa. Se abre igual.
 */
export function CardTileStatic({ card, onOpen }: CardTileStaticProps) {
  return (
    <div
      className={classes.card}
      role="button"
      tabIndex={0}
      aria-label={`Abrir tarjeta ${card.title}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <CardTileBody card={card} />
    </div>
  )
}
