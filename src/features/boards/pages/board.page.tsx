import { ActionIcon, Badge, Button, Center, Loader, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconArchive, IconArrowLeft, IconSettings, IconUsers } from '@tabler/icons-react'
import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/app/page-container'
import { useBoardLabels } from '@/features/labels/hooks/use-board-labels'
import { useBoard } from '../hooks/use-board'
import { useBoardFilter } from '../hooks/use-board-filter'
import { useBoardMembers } from '../hooks/use-board-members'
import { useTrackRecentBoard } from '../hooks/use-recent-boards'
import { countCards, filterCardsByList } from '../utils/board-filter'
import { BoardFilterPopover } from '../components/board-filter-popover'
import { BoardFilterSummary } from '../components/board-filter-summary'
import { BoardNameInlineEdit } from '../components/board-name-inline-edit'
import { BoardSettingsPanel } from '../components/board-settings-panel'
import { BoardMembersPanel } from '../components/board-members-panel'
import { BoardListsBoard } from '@/features/lists/components/board-lists-board'
import { BoardViewSwitcher } from '@/features/board-views/components/board-view-switcher'
import { BoardTableView } from '@/features/board-views/components/board-table-view'
import { BoardCalendarView } from '@/features/board-views/components/board-calendar-view'
import { useBoardView } from '@/features/board-views/hooks/use-board-view'
import { BoardArchivePanel } from '../components/board-archive-panel'
import { useBoardLists } from '@/features/lists/hooks/use-board-lists'
import { useBoardCards } from '@/features/cards/hooks/use-board-cards'
import { useBoardArchivedCards } from '@/features/cards/hooks/use-board-archived-cards'
import { CardDetailPanel } from '@/features/cards/components/card-detail-panel'
import type { Card } from '@/features/cards/types'
import classes from './board-page.module.css'

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const { board, isLoading } = useBoard(boardId)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCardId = searchParams.get('card')
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false)
  const [membersOpened, { open: openMembers, close: closeMembers }] =
    useDisclosure(false)
  const [archiveOpened, { open: openArchive, close: closeArchive }] =
    useDisclosure(false)

  const listsQuery = useBoardLists(board?.id, 'active')
  const { cardsByList, isLoading: isLoadingCards } = useBoardCards(
    listsQuery.data ?? [],
  )

  // Accesos recientes del command palette (T11.3). Se registra el tablero
  // resuelto, no el id de la URL: un id inexistente no es una visita.
  useTrackRecentBoard(board?.id)

  const boardFilter = useBoardFilter()
  const { view, setView, isResolving: isResolvingView } = useBoardView(board?.id)
  const membersQuery = useBoardMembers(board?.id)
  const labelsQuery = useBoardLabels(board?.id)

  // El contador de ocultas necesita las dos cifras, y sólo el cliente las
  // tiene: un endpoint que devolviera lo filtrado no sabría cuántas escondió.
  const totalCount = useMemo(() => countCards(cardsByList), [cardsByList])
  const visibleCount = useMemo(
    () => countCards(filterCardsByList(cardsByList, boardFilter.filter)),
    [cardsByList, boardFilter.filter],
  )
  const activeCard = selectedCardId
    ? Object.values(cardsByList)
        .flat()
        .find((card) => card.id === selectedCardId)
    : undefined

  /**
   * Un resultado de la búsqueda global (T11.2) puede apuntar a una tarjeta
   * archivada, y el tablero sólo tiene en cache las activas. Las archivadas se
   * piden recién cuando la tarjeta pedida por URL no aparece entre ellas: es el
   * caso raro, no algo que deba pagar cada apertura del tablero.
   */
  const needsArchivedLookup =
    !!selectedCardId && !activeCard && !isLoadingCards
  const archivedListsQuery = useBoardLists(
    needsArchivedLookup ? board?.id : undefined,
    'archived',
  )
  const allLists = useMemo(
    () => [...(listsQuery.data ?? []), ...(archivedListsQuery.data ?? [])],
    [listsQuery.data, archivedListsQuery.data],
  )
  const { cards: archivedCards, isLoading: isLoadingArchivedCards } =
    useBoardArchivedCards(needsArchivedLookup ? allLists : [])

  const selectedCard =
    activeCard ??
    (selectedCardId
      ? archivedCards.find((card) => card.id === selectedCardId)
      : undefined)

  const openCard = (card: Card) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('card', card.id)
      return next
    })
  }

  const closeCard = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('card')
      return next
    })
  }

  if (isLoading || isResolvingView) {
    return (
      <Center py={80}>
        <Loader />
      </Center>
    )
  }

  if (!board) {
    return (
      <PageContainer>
        <Stack align="center" gap="sm" py={80}>
          <Title order={2} size="h3">
            No encontramos este tablero
          </Title>
          <Text c="dimmed" size="sm">
            Puede que haya sido eliminado o ya no tengas acceso.
          </Text>
          <Button component={Link} to="/" variant="default">
            Volver a Mis tableros
          </Button>
        </Stack>
      </PageContainer>
    )
  }

  return (
    <div className={classes.shell}>
      <header className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          <ActionIcon
            component={Link}
            to="/"
            variant="subtle"
            color="gray"
            aria-label="Volver a Mis tableros"
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
          <BoardNameInlineEdit board={board} editable />
          {board.status === 'archived' && (
            <Badge color="gray" variant="light" size="sm">
              Archivado
            </Badge>
          )}
        </div>

        <div className={classes.toolbarActions}>
          <BoardViewSwitcher view={view} onChange={setView} />
          <BoardFilterPopover
            members={membersQuery.data ?? []}
            labels={labelsQuery.data ?? []}
            filter={boardFilter}
          />
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconArchive size={16} />}
            onClick={openArchive}
          >
            Archivo
          </Button>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconUsers size={16} />}
            onClick={openMembers}
          >
            Miembros
          </Button>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconSettings size={16} />}
            onClick={openSettings}
          >
            Configuración
          </Button>
        </div>
      </header>

      {boardFilter.isActive && (
        <BoardFilterSummary
          members={membersQuery.data ?? []}
          labels={labelsQuery.data ?? []}
          filter={boardFilter}
          visibleCount={visibleCount}
          totalCount={totalCount}
        />
      )}

      {/* Las tres vistas son proyecciones de las mismas queries: el filtro, su
          resumen y el detalle de tarjeta son los mismos en las tres, y sólo
          cambia el cuerpo. */}
      {view === 'board' && (
        <BoardListsBoard boardId={board.id} onOpenCard={openCard} />
      )}
      {view === 'table' && (
        <BoardTableView boardId={board.id} onOpenCard={openCard} />
      )}
      {view === 'calendar' && (
        <BoardCalendarView boardId={board.id} onOpenCard={openCard} />
      )}

      <CardDetailPanel
        card={selectedCard}
        boardId={board.id}
        isLoading={
          isLoadingCards || (needsArchivedLookup && isLoadingArchivedCards)
        }
        opened={!!selectedCardId}
        onClose={closeCard}
      />

      <BoardMembersPanel
        board={board}
        opened={membersOpened}
        onClose={closeMembers}
      />

      <BoardSettingsPanel
        board={board}
        opened={settingsOpened}
        onClose={closeSettings}
      />

      <BoardArchivePanel
        boardId={board.id}
        opened={archiveOpened}
        onClose={closeArchive}
      />
    </div>
  )
}
