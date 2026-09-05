/** Única definición de la ruta de resultados: la usan el router y el header. */
export const SEARCH_ROUTE = '/search'

/**
 * Debajo de este ancho el campo del header no entra junto a la marca y las
 * acciones, así que el buscador se muda a la pantalla de resultados. El
 * header y la pantalla leen la misma constante para que nunca queden los dos
 * campos a la vez, ni ninguno.
 */
export const SEARCH_COMPACT_QUERY = '(max-width: 47.99em)'
