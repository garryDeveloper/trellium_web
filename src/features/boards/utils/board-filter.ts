import type { Card } from '@/features/cards/types'
import {
  getDueDateStatus,
  type DueDateStatus,
} from '@/features/cards/utils/due-date'
import { FILTER_NONE, type BoardFilter } from '../types'

export const EMPTY_BOARD_FILTER: BoardFilter = {
  memberIds: [],
  labelIds: [],
  due: [],
  text: '',
}

const DUE_STATUSES: DueDateStatus[] = ['overdue', 'due-soon', 'on-time', 'none']

function isDueStatus(value: string): value is DueDateStatus {
  return (DUE_STATUSES as string[]).includes(value)
}

/**
 * Comparación de texto tolerante: sin distinguir mayúsculas ni acentos, para
 * que "diseno" encuentre "Diseño". Es lo mismo que espera cualquiera que
 * escriba rápido y sin tildes.
 */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function isBoardFilterActive(filter: BoardFilter): boolean {
  return (
    filter.memberIds.length > 0 ||
    filter.labelIds.length > 0 ||
    filter.due.length > 0 ||
    filter.text.trim() !== ''
  )
}

/** Cuántas condiciones activas hay, para el contador del botón de filtros. */
export function countActiveFilters(filter: BoardFilter): number {
  return (
    filter.memberIds.length +
    filter.labelIds.length +
    filter.due.length +
    (filter.text.trim() === '' ? 0 : 1)
  )
}

function matchesMembers(card: Card, memberIds: string[]): boolean {
  if (memberIds.length === 0) return true
  return memberIds.some((memberId) =>
    memberId === FILTER_NONE
      ? card.assignees.length === 0
      : card.assignees.some((assignee) => assignee.id === memberId),
  )
}

function matchesLabels(card: Card, labelIds: string[]): boolean {
  if (labelIds.length === 0) return true
  return labelIds.some((labelId) =>
    labelId === FILTER_NONE
      ? card.labels.length === 0
      : card.labels.some((label) => label.id === labelId),
  )
}

function matchesDue(card: Card, due: DueDateStatus[]): boolean {
  if (due.length === 0) return true
  return due.includes(getDueDateStatus(card.dueDate))
}

function matchesText(card: Card, text: string): boolean {
  const needle = normalize(text.trim())
  if (needle === '') return true
  return (
    normalize(card.title).includes(needle) ||
    normalize(card.description ?? '').includes(needle)
  )
}

/**
 * El predicado del filtro. Puro y sobre una `Card` ya cargada: todo lo que
 * necesita (responsables, etiquetas, vencimiento, descripción) viene en la
 * respuesta de `GET /lists/{listId}/cards`, así que filtrar no dispara red.
 *
 * OR dentro de cada categoría, AND entre categorías.
 */
export function matchesBoardFilter(card: Card, filter: BoardFilter): boolean {
  return (
    matchesMembers(card, filter.memberIds) &&
    matchesLabels(card, filter.labelIds) &&
    matchesDue(card, filter.due) &&
    matchesText(card, filter.text)
  )
}

/**
 * Aplica el filtro conservando TODAS las listas, incluso las que quedan
 * vacías: esconderlas haría parecer que el tablero cambió de estructura.
 */
export function filterCardsByList(
  cardsByList: Record<string, Card[]>,
  filter: BoardFilter,
): Record<string, Card[]> {
  const result: Record<string, Card[]> = {}
  for (const [listId, cards] of Object.entries(cardsByList)) {
    result[listId] = cards.filter((card) => matchesBoardFilter(card, filter))
  }
  return result
}

export function countCards(cardsByList: Record<string, Card[]>): number {
  return Object.values(cardsByList).reduce(
    (total, cards) => total + cards.length,
    0,
  )
}

/** Repetidos con el mismo valor sólo pueden venir de una URL editada a mano. */
function uniqueValues(params: URLSearchParams, key: string): string[] {
  return [...new Set(params.getAll(key))]
}

/**
 * Lee el filtro de la URL. Es la única fuente de verdad: no hay estado
 * paralelo en React, así que recargar o compartir el enlace conserva el filtro
 * sin trabajo extra.
 */
export function parseBoardFilter(params: URLSearchParams): BoardFilter {
  return {
    memberIds: uniqueValues(params, 'member'),
    labelIds: uniqueValues(params, 'label'),
    // Un valor desconocido (URL editada a mano) se descarta en vez de vaciar
    // el tablero con una condición que ninguna tarjeta puede cumplir.
    due: uniqueValues(params, 'due').filter(isDueStatus),
    text: params.get('q') ?? '',
  }
}

/**
 * Escribe el filtro en la URL con parámetros repetidos (`label=a&label=b`),
 * que es lo que `URLSearchParams` serializa y lee de forma nativa. Un
 * parámetro ausente significa "categoría sin filtrar": nunca se escribe vacío.
 */
export function writeBoardFilter(
  params: URLSearchParams,
  filter: BoardFilter,
): URLSearchParams {
  const next = new URLSearchParams(params)
  next.delete('member')
  next.delete('label')
  next.delete('due')
  next.delete('q')

  filter.memberIds.forEach((memberId) => next.append('member', memberId))
  filter.labelIds.forEach((labelId) => next.append('label', labelId))
  filter.due.forEach((due) => next.append('due', due))
  if (filter.text.trim() !== '') next.set('q', filter.text)

  return next
}
