/**
 * Pliega acentos y mayúsculas con el mismo criterio que `tr_unaccent` en el
 * servidor (ver `data-model.md`): la descomposición NFD separa la tilde de la
 * letra, y quitarla deja "á"→"a" y "ñ"→"n". Que los dos lados entiendan lo
 * mismo por "la misma letra" es lo que evita que buscar "diseño" encuentre una
 * tarjeta en el servidor pero no la acción local que dice "Diseño".
 */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/**
 * Filtrado local de las acciones del command palette (T11.3).
 *
 * A diferencia del servidor —que hace match por prefijo de palabra para poder
 * usar el índice— acá alcanza con `includes`: son un puñado de etiquetas
 * cortas, y sobre "Cerrar sesión" escribir "sesion" tiene que encontrar algo.
 * Todos los términos deben aparecer: escribir más palabras siempre acota.
 */
export function matchesQuery(
  query: string,
  ...fields: Array<string | string[] | undefined>
): boolean {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean)
  if (terms.length === 0) {
    return true
  }

  const haystack = normalize(
    fields
      .flat()
      .filter((field): field is string => !!field)
      .join(' '),
  )

  return terms.every((term) => haystack.includes(term))
}
