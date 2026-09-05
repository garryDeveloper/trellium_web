import { Group, Text } from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { Spotlight, type SpotlightActionData } from '@mantine/spotlight'
import {
  IconBell,
  IconChecklist,
  IconLayoutKanban,
  IconListDetails,
  IconLogout,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { CreateBoardModal } from '@/features/boards/components/create-board-modal'
import { useRecentBoards } from '@/features/boards/hooks/use-recent-boards'
import { useBoardLists } from '@/features/lists/hooks/use-board-lists'
import { useSearch } from '@/features/search/hooks/use-search'
import { SEARCH_ROUTE } from '@/features/search/route'
import { MIN_SEARCH_LENGTH } from '@/features/search/types'
import { MY_WORK_ROUTE } from '@/features/board-views/route'
import { matchesQuery } from '@/features/search/utils/match-query'

interface CommandPaletteProps {
  /** El panel de notificaciones lo controla el layout, no la paleta. */
  onOpenNotifications: () => void
}

/**
 * Command palette (T11.3). Vive en `app/` porque es shell —está disponible en
 * toda la aplicación, no dentro de una pantalla— y se alimenta de los hooks de
 * `features/search` (`frontend-architecture.md`).
 *
 * Se apoya en `@mantine/spotlight`, que ya resuelve lo que hace correcto a un
 * command palette y es tedioso de reescribir: el atajo global, el foco
 * atrapado, la navegación con flechas, `Enter` para ejecutar y `Esc` para
 * cerrar. Lo que sí es nuestro es **qué** se lista y con qué criterio.
 */
export function CommandPalette({ onOpenNotifications }: CommandPaletteProps) {
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const [searchParams, setSearchParams] = useSearchParams()
  const [createBoardOpened, createBoard] = useDisclosure(false)

  // La paleta está montada siempre, pero no debe costar nada mientras está
  // cerrada: todas las queries de acá abajo cuelgan de `opened`.
  const [opened, setOpened] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 250)

  const boardMatch = useMatch('/boards/:boardId')
  const currentBoardId = boardMatch?.params.boardId

  const recentBoards = useRecentBoards(opened)
  const listsQuery = useBoardLists(
    opened ? currentBoardId : undefined,
    'active',
  )
  // "Crear tarjeta en el tablero actual" necesita una lista donde ponerla. Un
  // tablero todavía sin listas no ofrece la acción: el contexto no existe.
  const targetList = listsQuery.data?.[0]

  const { data: results, isSearching } = useSearch({
    q: opened ? debouncedQuery : '',
    includeArchived: false,
  })

  const actions = useMemo(() => {
    const trimmed = query.trim()

    const commands: SpotlightActionData[] = [
      {
        id: 'go-my-work',
        label: 'Ir a Mi trabajo',
        description: 'Todo lo que tenés asignado, agrupado por vencimiento',
        keywords: ['mi trabajo', 'asignadas', 'pendientes', 'todo'],
        leftSection: <IconChecklist size={18} stroke={1.5} />,
        onClick: () => navigate(MY_WORK_ROUTE),
      },
      {
        id: 'go-boards',
        label: 'Ir a Mis tableros',
        description: 'Todos los tableros donde sos propietario o miembro',
        keywords: ['inicio', 'home', 'tableros'],
        leftSection: <IconLayoutKanban size={18} stroke={1.5} />,
        onClick: () => navigate('/'),
      },
      {
        id: 'go-search',
        label: 'Buscar en todos los tableros',
        description: 'Abrir la pantalla de resultados',
        keywords: ['buscar', 'busqueda', 'search'],
        leftSection: <IconSearch size={18} stroke={1.5} />,
        onClick: () =>
          navigate(
            trimmed.length >= MIN_SEARCH_LENGTH
              ? `${SEARCH_ROUTE}?q=${encodeURIComponent(trimmed)}`
              : SEARCH_ROUTE,
          ),
      },
      {
        id: 'create-board',
        label: 'Crear tablero',
        keywords: ['nuevo', 'new', 'agregar'],
        leftSection: <IconPlus size={18} stroke={1.5} />,
        onClick: createBoard.open,
      },
      ...(targetList
        ? [
            {
              id: 'create-card',
              label: 'Crear tarjeta en este tablero',
              description: `En la lista "${targetList.name}"`,
              keywords: ['nueva', 'tarjeta', 'card'],
              leftSection: <IconListDetails size={18} stroke={1.5} />,
              // El formulario inline de la lista se abre por URL, igual que el
              // tablero ya abre una tarjeta con `?card=`. La paleta no necesita
              // un canal propio hacia adentro de la pantalla.
              onClick: () => {
                const next = new URLSearchParams(searchParams)
                next.set('newCard', targetList.id)
                setSearchParams(next)
              },
            } satisfies SpotlightActionData,
          ]
        : []),
      {
        id: 'open-notifications',
        label: 'Abrir notificaciones',
        keywords: ['avisos', 'campana', 'inbox'],
        leftSection: <IconBell size={18} stroke={1.5} />,
        onClick: onOpenNotifications,
      },
      {
        id: 'logout',
        label: 'Cerrar sesión',
        keywords: ['salir', 'logout'],
        leftSection: <IconLogout size={18} stroke={1.5} />,
        onClick: () => logoutMutation.mutate(),
      },
    ].filter((action) =>
      matchesQuery(trimmed, action.label, action.description, action.keywords),
    )

    const groups = []
    if (commands.length > 0) {
      groups.push({ group: 'Acciones', actions: commands })
    }

    if (!trimmed) {
      // Sin texto: accesos recientes. Los resultados de búsqueda no tienen
      // sentido acá porque no hay nada que buscar todavía.
      if (recentBoards.length > 0) {
        groups.push({
          group: 'Tableros recientes',
          actions: recentBoards.map((board) => ({
            id: `recent-${board.id}`,
            label: board.name,
            leftSection: <IconLayoutKanban size={18} stroke={1.5} />,
            onClick: () => navigate(`/boards/${board.id}`),
          })),
        })
      }
      return groups
    }

    if (results && results.boards.length > 0) {
      groups.push({
        group: 'Tableros',
        actions: results.boards.map((board) => ({
          id: `board-${board.id}`,
          label: board.name,
          leftSection: <IconLayoutKanban size={18} stroke={1.5} />,
          onClick: () => navigate(`/boards/${board.id}`),
        })),
      })
    }

    if (results && results.cards.length > 0) {
      groups.push({
        group: 'Tarjetas',
        actions: results.cards.map((hit) => ({
          id: `card-${hit.card.id}`,
          label: hit.card.title,
          description: `${hit.boardName} · ${hit.listName}`,
          leftSection: <IconListDetails size={18} stroke={1.5} />,
          onClick: () =>
            navigate(`/boards/${hit.boardId}?card=${hit.card.id}`),
        })),
      })
    }

    return groups
  }, [
    query,
    results,
    recentBoards,
    targetList,
    navigate,
    searchParams,
    setSearchParams,
    createBoard.open,
    onOpenNotifications,
    logoutMutation,
  ])

  return (
    <>
      <Spotlight
        actions={actions}
        query={query}
        onQueryChange={setQuery}
        onSpotlightOpen={() => setOpened(true)}
        onSpotlightClose={() => setOpened(false)}
        // Ya vienen filtradas: las acciones contra el texto, y las tarjetas y
        // tableros contra el servidor. Volver a filtrar acá escondería
        // resultados que el servidor encontró por la descripción o por la raíz
        // de la palabra, que el cliente no puede reproducir.
        filter={(_, spotlightActions) => spotlightActions}
        // Sin tags ignorados: `⌘K` tiene que abrir la paleta también desde el
        // buscador del header o desde el título de una tarjeta — "desde
        // cualquier pantalla" incluye tener el cursor en un campo.
        tagsToIgnore={[]}
        scrollable
        maxHeight={420}
        searchProps={{
          leftSection: <IconSearch size={18} stroke={1.5} />,
          placeholder: 'Buscar tableros y tarjetas, o ejecutar una acción…',
        }}
        nothingFound={
          <Group justify="center" py="sm">
            <Text size="sm" c="dimmed">
              {isSearching
                ? 'Buscando…'
                : query.trim().length < MIN_SEARCH_LENGTH
                  ? `Escribí al menos ${MIN_SEARCH_LENGTH} caracteres`
                  : 'Sin resultados'}
            </Text>
          </Group>
        }
      />

      <CreateBoardModal
        opened={createBoardOpened}
        onClose={createBoard.close}
      />
    </>
  )
}
