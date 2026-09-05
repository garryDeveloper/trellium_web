import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { search } from '../api/search.api'
import { MIN_SEARCH_LENGTH, type SearchParams } from '../types'

export const SEARCH_QUERY_KEY = 'search'

/**
 * Búsqueda global (T11.2).
 *
 * `keepPreviousData` es lo que hace que escribir se sienta continuo: sin eso la
 * lista se vacía en cada tecla y la pantalla parpadea entre "hay resultados" y
 * "cargando". El texto ya llega estabilizado desde quien llama (la URL sólo se
 * actualiza cuando el usuario deja de escribir), así que este hook no debouncea
 * nada por su cuenta.
 */
export function useSearch({ q, includeArchived }: SearchParams) {
  const trimmed = q.trim()
  const isEnabled = trimmed.length >= MIN_SEARCH_LENGTH

  const query = useQuery({
    queryKey: [SEARCH_QUERY_KEY, trimmed, includeArchived],
    queryFn: () => search({ q: trimmed, includeArchived }),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    // Los resultados envejecen rápido (alguien puede haber movido la tarjeta),
    // pero volver de un resultado a la lista no debería costar un ida y vuelta.
    staleTime: 30_000,
  })

  return {
    ...query,
    /** `false` mientras el texto es demasiado corto: no hay búsqueda en curso. */
    isSearching: isEnabled && query.isFetching,
    isTooShort: trimmed.length > 0 && !isEnabled,
  }
}
