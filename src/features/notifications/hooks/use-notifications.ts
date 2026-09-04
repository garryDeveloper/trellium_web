import { useQuery } from '@tanstack/react-query'
import { listMyNotifications } from '../api/notifications.api'

/**
 * No hay tiempo real en el MVP (`product.md`), así que el inbox se refresca por
 * pull: al volver a la pestaña y con un intervalo tranquilo. Un minuto alcanza
 * para que la campana no quede desactualizada sin convertir esto en un poller
 * agresivo.
 */
export const NOTIFICATIONS_QUERY_KEY = ['notifications']

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: listMyNotifications,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  })
}
