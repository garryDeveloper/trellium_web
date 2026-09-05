import { ActionIcon, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { SEARCH_COMPACT_QUERY, SEARCH_ROUTE } from '../route'
import { SearchField } from './search-field'
import classes from './global-search.module.css'

/**
 * El punto de búsqueda del header. Vive en el layout, así que se llega a él
 * desde cualquier pantalla (T11.2).
 *
 * En pantallas angostas el campo no entra, y un input de 100px no es un
 * buscador: queda sólo el atajo, y el campo lo pone la pantalla de resultados.
 */
export function GlobalSearch() {
  const isCompact = useMediaQuery(SEARCH_COMPACT_QUERY, false, {
    getInitialValueInEffect: false,
  })

  if (isCompact) {
    return (
      <Tooltip label="Buscar">
        <ActionIcon
          component={Link}
          to={SEARCH_ROUTE}
          variant="subtle"
          color="gray"
          size="lg"
          aria-label="Buscar"
        >
          <IconSearch size={18} />
        </ActionIcon>
      </Tooltip>
    )
  }

  return <SearchField className={classes.form} />
}
