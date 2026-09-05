import { CloseButton, Kbd, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getModifierKeyLabel } from '@/shared/utils/hotkey'
import { MIN_SEARCH_LENGTH } from '../types'
import { SEARCH_ROUTE } from '../route'

interface SearchFieldProps {
  className?: string
  autoFocus?: boolean
}

/**
 * El campo de la búsqueda global (T11.2). Hay uno solo montado a la vez —en el
 * header o, cuando el header no tiene lugar, en la pantalla de resultados— y su
 * único estado compartido es el `?q` de la URL.
 *
 * La URL es la fuente de verdad (`frontend-architecture.md`): así una búsqueda
 * se comparte por enlace, sobrevive a un refresh y responde al botón de atrás
 * sin que haga falta un store.
 */
export function SearchField({ className, autoFocus }: SearchFieldProps) {
  const modifierKey = getModifierKeyLabel()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const isOnSearchPage = location.pathname === SEARCH_ROUTE
  // Fuera de la pantalla de resultados el campo arranca vacío: de vuelta en un
  // tablero, la consulta anterior ya no describe lo que se está mirando.
  const urlQuery = isOnSearchPage ? (searchParams.get('q') ?? '') : ''

  const [value, setValue] = useState(urlQuery)
  const [debouncedValue] = useDebouncedValue(value, 300)
  // Última consulta que este campo escribió en la URL. Distingue "la URL cambió
  // por mi culpa" de "la URL cambió por fuera" (el botón de atrás, un enlace
  // compartido), que es el único caso en el que hay que pisar lo que el usuario
  // está tipeando.
  const lastWrittenRef = useRef(urlQuery)

  useEffect(() => {
    if (urlQuery !== lastWrittenRef.current) {
      lastWrittenRef.current = urlQuery
      setValue(urlQuery)
    }
  }, [urlQuery])

  useEffect(() => {
    // Mientras se ven resultados, cada pausa al escribir los actualiza. Fuera de
    // esa pantalla no se navega solo: escribir en el header no debería sacar a
    // nadie del tablero en el que está trabajando.
    if (!isOnSearchPage) return

    const trimmed = debouncedValue.trim()
    if (trimmed === (searchParams.get('q') ?? '')) return

    lastWrittenRef.current = trimmed
    const next = new URLSearchParams(searchParams)
    if (trimmed) {
      next.set('q', trimmed)
    } else {
      next.delete('q')
    }
    // `replace`: refinar una búsqueda es una sola intención, no una por tecla.
    setSearchParams(next, { replace: true })
  }, [debouncedValue, isOnSearchPage, searchParams, setSearchParams])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (isOnSearchPage || trimmed.length < MIN_SEARCH_LENGTH) return

    lastWrittenRef.current = trimmed
    navigate(`${SEARCH_ROUTE}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={className}
      aria-label="Búsqueda global"
    >
      <TextInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="Buscar tarjetas y tableros"
        aria-label="Buscar tarjetas y tableros"
        autoFocus={autoFocus}
        leftSection={<IconSearch size={16} />}
        rightSection={
          value ? (
            <CloseButton
              size="sm"
              aria-label="Limpiar búsqueda"
              onClick={() => setValue('')}
            />
          ) : (
            /* Único lugar donde el atajo del command palette (T11.3) se
               anuncia. Es decorativo —`aria-hidden`— porque el campo ya tiene
               su propia etiqueta y quien navega por teclado no necesita que se
               le lea "Ctrl K" cada vez que entra al buscador. */
            <Kbd size="xs" aria-hidden>
              {modifierKey} K
            </Kbd>
          )
        }
        rightSectionWidth={value ? undefined : 62}
      />
    </form>
  )
}
