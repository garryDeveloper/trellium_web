import type { BoardMember } from '@/features/boards/types'
import type { Card } from '@/features/cards/types'
import {
  getDueDateStatus,
  type DueDateStatus,
} from '@/features/cards/utils/due-date'
import type { Label } from '@/features/labels/types'
import type { BoardGroupBy } from '../types'

/** Agrupaciones que rearman el tablero; "por lista" es el tablero de siempre. */
export type CardGrouping = Exclude<BoardGroupBy, 'list'>

export interface CardGroup {
  key: string
  name: string
  cards: Card[]
  /** El grupo de las que no tienen miembro, etiqueta o fecha. */
  isEmptyBucket: boolean
  /** Al agrupar por etiqueta, el encabezado pinta el chip real. */
  label?: Label
}

const UNGROUPED_KEY = '__none__'

const UNGROUPED_NAME: Record<CardGrouping, string> = {
  assignee: 'Sin asignar',
  label: 'Sin etiqueta',
  due_date: 'Sin fecha límite',
}

/** De lo más urgente a lo que no corre: el orden es el criterio de lectura. */
const DUE_GROUP_ORDER: DueDateStatus[] = [
  'overdue',
  'due-soon',
  'on-time',
  'none',
]

const DUE_GROUP_NAME: Record<DueDateStatus, string> = {
  overdue: 'Vencidas',
  'due-soon': 'Vencen pronto',
  'on-time': 'A tiempo',
  none: 'Sin fecha límite',
}

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true })

interface Bucket {
  key: string
  name: string
  cards: Card[]
  label?: Label
}

/**
 * Agrupa por una faceta que la tarjeta puede tener repetida (miembros,
 * etiquetas): una tarjeta cae en tantos grupos como valores tenga, y las que no
 * tienen ninguno van al grupo explícito del final.
 *
 * El orden lo fija `order` — los miembros y las etiquetas del tablero, en el
 * orden en que el tablero ya los muestra — y no el orden en que aparecen las
 * tarjetas, que cambiaría con cada movimiento. Un valor que no esté en `order`
 * (un responsable que ya no es miembro, por ejemplo) igual arma su grupo, al
 * final y alfabético: perder una tarjeta sería peor que ordenarla distinto.
 */
function groupByFacet(
  cards: Card[],
  grouping: CardGrouping,
  facetsOf: (card: Card) => { id: string; name: string; label?: Label }[],
  order: string[],
): CardGroup[] {
  const rank = new Map(order.map((id, index) => [id, index]))
  const buckets = new Map<string, Bucket>()
  const withoutFacet: Card[] = []

  for (const card of cards) {
    const facets = facetsOf(card)
    if (facets.length === 0) {
      withoutFacet.push(card)
      continue
    }
    for (const facet of facets) {
      const bucket = buckets.get(facet.id) ?? {
        key: facet.id,
        name: facet.name,
        label: facet.label,
        cards: [],
      }
      bucket.cards.push(card)
      buckets.set(facet.id, bucket)
    }
  }

  const groups: CardGroup[] = [...buckets.values()]
    .sort((a, b) => {
      const rankA = rank.get(a.key) ?? Number.POSITIVE_INFINITY
      const rankB = rank.get(b.key) ?? Number.POSITIVE_INFINITY
      if (rankA !== rankB) return rankA - rankB
      return collator.compare(a.name, b.name)
    })
    .map((bucket) => ({ ...bucket, isEmptyBucket: false }))

  if (withoutFacet.length > 0) {
    groups.push({
      key: UNGROUPED_KEY,
      name: UNGROUPED_NAME[grouping],
      cards: withoutFacet,
      isEmptyBucket: true,
    })
  }

  return groups
}

/**
 * Los grupos que se muestran (T12.3). Agrupar es sólo lectura: reordena la
 * pantalla y no toca la lista ni la posición de ninguna tarjeta (`domain.md`,
 * reglas 3 y 4).
 *
 * Un grupo vacío no se devuelve: una columna "Sin etiqueta" en un tablero donde
 * todas las tarjetas tienen etiqueta es una columna que hay que descartar con
 * la vista cada vez. El orden de las tarjetas dentro de cada grupo es el que
 * traían — el del tablero, o el de la columna ordenada en la vista Tabla.
 */
export function buildCardGroups(
  grouping: CardGrouping,
  cards: Card[],
  members: BoardMember[],
  labels: Label[],
): CardGroup[] {
  switch (grouping) {
    case 'assignee':
      return groupByFacet(
        cards,
        grouping,
        (card) => card.assignees.map((user) => ({ id: user.id, name: user.name })),
        members.map((member) => member.userId),
      )
    case 'label':
      return groupByFacet(
        cards,
        grouping,
        (card) =>
          card.labels.map((label) => ({
            id: label.id,
            name: label.name,
            label,
          })),
        labels.map((label) => label.id),
      )
    case 'due_date': {
      // El vencimiento es derivado y excluyente: una tarjeta está en uno solo de
      // los cuatro estados, así que acá no hay duplicados posibles.
      const byStatus = new Map<DueDateStatus, Card[]>()
      for (const card of cards) {
        const status = getDueDateStatus(card.dueDate)
        byStatus.set(status, [...(byStatus.get(status) ?? []), card])
      }
      return DUE_GROUP_ORDER.filter((status) => byStatus.get(status)?.length).map(
        (status) => ({
          key: status,
          name: DUE_GROUP_NAME[status],
          cards: byStatus.get(status) ?? [],
          isEmptyBucket: status === 'none',
        }),
      )
    }
  }
}

/**
 * Cuántas tarjetas aparecen en más de un grupo. Es lo que hace que la suma de
 * los contadores no dé el total del tablero, así que hay que decirlo.
 */
export function countMultiGroupCards(
  grouping: CardGrouping,
  cards: Card[],
): number {
  if (grouping === 'due_date') return 0
  return cards.filter(
    (card) =>
      (grouping === 'assignee' ? card.assignees.length : card.labels.length) > 1,
  ).length
}
