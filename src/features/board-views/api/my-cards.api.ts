import { httpClient } from '@/shared/api/http-client'
import type { MyCardHit } from '../types'

/**
 * `GET /me/cards` — tarjetas activas asignadas al usuario en todos sus tableros
 * (T12.4). El endpoint acepta `?boardId`, pero la pantalla trae la lista
 * completa una vez y filtra en el cliente: el filtro por tablero se aplica
 * sobre datos que ya están en memoria, sin ida y vuelta por cada cambio.
 */
export async function listMyCards(): Promise<MyCardHit[]> {
  const { data } = await httpClient.get<{ cards: MyCardHit[] }>('/me/cards')
  return data.cards
}
