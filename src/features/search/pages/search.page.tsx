import {
  Center,
  Group,
  Loader,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconSearch, IconSearchOff } from '@tabler/icons-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/app/page-container'
import { SearchField } from '../components/search-field'
import { SearchResultBoard } from '../components/search-result-board'
import { SearchResultCard } from '../components/search-result-card'
import { useSearch } from '../hooks/use-search'
import { SEARCH_COMPACT_QUERY } from '../route'
import { MIN_SEARCH_LENGTH } from '../types'
import { groupHitsByBoard } from '../utils/group-by-board'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const includeArchived = searchParams.get('includeArchived') === 'true'

  // En angosto el campo del header no se renderiza, así que lo pone la pantalla.
  const isCompact = useMediaQuery(SEARCH_COMPACT_QUERY, false, {
    getInitialValueInEffect: false,
  })

  const { data, isLoading, isSearching, isTooShort } = useSearch({
    q,
    includeArchived,
  })

  const boardGroups = useMemo(
    () => groupHitsByBoard(data?.cards ?? []),
    [data?.cards],
  )

  const boards = data?.boards ?? []
  const totalResults = (data?.cards.length ?? 0) + boards.length
  const hasQuery = q.trim().length >= MIN_SEARCH_LENGTH

  const setIncludeArchived = (checked: boolean) => {
    const next = new URLSearchParams(searchParams)
    if (checked) {
      next.set('includeArchived', 'true')
    } else {
      next.delete('includeArchived')
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <PageContainer>
      <Stack gap="xl">
        <Stack gap={2}>
          <Title order={1}>Buscar</Title>
          <Text c="dimmed" size="sm">
            Tarjetas y tableros de todos los tableros donde sos miembro.
          </Text>
        </Stack>

        {isCompact && <SearchField autoFocus />}

        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          {/* El `Group` conserva los dos extremos aunque no haya texto: así el
              switch no salta de lugar al aparecer el primer resultado. */}
          <Text size="sm" c="dimmed">
            {/* Mientras se busca no se muestra el contador: los resultados en
                pantalla todavía son los de la consulta anterior, y decir
                "3 resultados para «X»" sobre la lista de «Y» sería mentira. */}
            {hasQuery && isSearching && `Buscando «${q.trim()}»…`}
            {hasQuery &&
              !isSearching &&
              !isLoading &&
              `${totalResults} ${totalResults === 1 ? 'resultado' : 'resultados'} para «${q.trim()}»`}
          </Text>
          <Switch
            checked={includeArchived}
            onChange={(event) => setIncludeArchived(event.currentTarget.checked)}
            label="Incluir archivadas"
          />
        </Group>

        {!hasQuery && (
          <Center py={80}>
            <Stack align="center" gap="sm" maw={380}>
              <ThemeIcon size={56} radius="xl" variant="light" color="primary">
                <IconSearch size={28} />
              </ThemeIcon>
              <Text c="dimmed" size="sm" ta="center">
                {isTooShort
                  ? `Escribí al menos ${MIN_SEARCH_LENGTH} caracteres para buscar.`
                  : 'Buscá por título o descripción de una tarjeta, o por el nombre de un tablero.'}
              </Text>
            </Stack>
          </Center>
        )}

        {hasQuery && isLoading && (
          <Center py={80}>
            <Loader />
          </Center>
        )}

        {/* `!isSearching`: si la búsqueda anterior no dio nada, seguir tipeando
            no debe hacer parpadear "sin resultados" con el texto nuevo antes de
            que el servidor conteste. */}
        {hasQuery && !isLoading && !isSearching && totalResults === 0 && (
          <Center py={80}>
            <Stack align="center" gap="sm" maw={380}>
              <ThemeIcon size={56} radius="xl" variant="light" color="gray">
                <IconSearchOff size={28} />
              </ThemeIcon>
              <Title order={2} size="h3" ta="center">
                Sin resultados para «{q.trim()}»
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                {includeArchived
                  ? 'Probá con otra palabra: la búsqueda mira el título y la descripción de las tarjetas, y el nombre de los tableros.'
                  : 'Probá con otra palabra, o activá «Incluir archivadas» si lo que buscás ya se archivó.'}
              </Text>
            </Stack>
          </Center>
        )}

        {hasQuery && !isLoading && boards.length > 0 && (
          <Stack gap="sm">
            <Title order={2} size="h5">
              Tableros
            </Title>
            {boards.map((board) => (
              <SearchResultBoard key={board.id} board={board} />
            ))}
          </Stack>
        )}

        {/* Agrupadas por tablero, con la lista visible en cada fila: es el
            criterio explícito de T11.2 y lo que hace que un resultado se
            entienda sin abrirlo. */}
        {hasQuery && !isLoading && boardGroups.length > 0 && (
          <Stack gap="sm">
            <Title order={2} size="h5">
              Tarjetas
            </Title>
            {boardGroups.map((group) => (
              <Stack key={group.boardId} gap="sm" mt="xs">
                {/* Sin icono: el encabezado "Tarjetas" ya dice qué son estas
                    filas, y a este tamaño un icono más sólo agrega ruido. */}
                <Title order={3} size="sm" fw={600} c="dimmed">
                  {group.boardName}
                </Title>
                {group.hits.map((hit) => (
                  <SearchResultCard key={hit.card.id} hit={hit} />
                ))}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </PageContainer>
  )
}
