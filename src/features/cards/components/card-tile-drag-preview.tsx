import { CardTileBody } from './card-tile-body'
import type { Card } from '../types'
import classes from './card-tile.module.css'

/**
 * La copia que sigue al cursor dentro del `DragOverlay`. Va en un portal fuera
 * de la columna, que es lo que le permite cruzar el `overflow` del cuerpo de la
 * lista y el del canvas sin recortarse.
 */
export function CardTileDragPreview({ card }: { card: Card }) {
  return (
    <div className={`${classes.card} ${classes.dragPreview}`}>
      <CardTileBody card={card} />
    </div>
  )
}
