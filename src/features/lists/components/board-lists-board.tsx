import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconLayoutColumns } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useBoardFilter } from '@/features/boards/hooks/use-board-filter'
import { filterCardsByList } from '@/features/boards/utils/board-filter'
import { useBoardCards } from '@/features/cards/hooks/use-board-cards'
import { useMoveCard } from '@/features/cards/hooks/use-move-card'
import { MoveCardModal } from '@/features/cards/components/move-card-modal'
import { CardTileDragPreview } from '@/features/cards/components/card-tile-drag-preview'
import type { Card } from '@/features/cards/types'
import { useBoardLists } from '../hooks/use-board-lists'
import { useReorderList } from '../hooks/use-reorder-list'
import { ListColumn } from './list-column'
import { CreateListInlineForm } from './create-list-inline-form'
import classes from './board-lists-board.module.css'

interface BoardListsBoardProps {
  boardId: string
  onOpenCard: (card: Card) => void
}

export function BoardListsBoard({ boardId, onOpenCard }: BoardListsBoardProps) {
  const listsQuery = useBoardLists(boardId, 'active')
  const reorderListMutation = useReorderList(boardId)
  const moveCardMutation = useMoveCard()
  const [cardToMove, setCardToMove] = useState<Card | null>(null)
  const [draggedCard, setDraggedCard] = useState<Card | null>(null)

  const lists = listsQuery.data ?? []
  const { cardsByList, isLoading: isLoadingCards } = useBoardCards(lists)
  const { filter, isActive: isFiltered } = useBoardFilter()

  /*
    El filtro sólo recorta lo que se RENDERIZA. Todo el cálculo de posiciones
    del drag-and-drop y el modal de mover siguen leyendo `cardsByList` sin
    filtrar: el índice de la tarjeta sobre la que se suelta tiene que ser el
    real, o mover una tarjeta con un filtro puesto la mandaría a otra posición
    que sin filtro.
  */
  const visibleCardsByList = useMemo(
    () => filterCardsByList(cardsByList, filter),
    [cardsByList, filter],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type !== 'card') return

    const listId = active.data.current?.listId as string
    const card = (cardsByList[listId] ?? []).find((item) => item.id === active.id)
    setDraggedCard(card ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedCard(null)
    const { active, over } = event
    if (!over) return

    const activeType = active.data.current?.type

    if (activeType === 'list') {
      if (active.id === over.id) return

      const activeIndex = lists.findIndex((list) => list.id === active.id)
      const overIndex = lists.findIndex((list) => list.id === over.id)
      if (activeIndex === -1 || overIndex === -1) return

      reorderListMutation.mutate({
        listId: active.id as string,
        position: overIndex + 1,
      })
      return
    }

    if (activeType === 'card') {
      const fromListId = active.data.current?.listId as string
      const overType = over.data.current?.type

      let toListId: string | undefined
      let overCardId: string | undefined

      if (overType === 'card') {
        toListId = over.data.current?.listId as string
        overCardId = over.id as string
      } else if (overType === 'list-dropzone') {
        toListId = over.data.current?.listId as string
      }

      if (!toListId) return

      const sourceCards = cardsByList[fromListId] ?? []
      const draggedCard = sourceCards.find((card) => card.id === active.id)
      if (!draggedCard) return

      const destinationCards = cardsByList[toListId] ?? []
      let targetPosition: number

      if (overCardId) {
        const overIndex = destinationCards.findIndex((card) => card.id === overCardId)
        targetPosition = overIndex === -1 ? destinationCards.length + 1 : overIndex + 1
      } else {
        targetPosition = destinationCards.length + (fromListId === toListId ? 0 : 1)
      }

      if (fromListId === toListId && targetPosition === draggedCard.position) return

      moveCardMutation.mutate({
        cardId: draggedCard.id,
        fromListId,
        listId: toListId,
        position: targetPosition,
      })
    }
  }

  if (listsQuery.isLoading) {
    return (
      <div className={classes.state}>
        <Loader />
      </div>
    )
  }

  if (lists.length === 0) {
    return (
      <div className={classes.state}>
        <Stack align="center" gap="lg">
          <Stack align="center" gap="sm" maw={380}>
            <ThemeIcon size={48} radius="xl" variant="light" color="primary">
              <IconLayoutColumns size={24} />
            </ThemeIcon>
            <Title order={2} size="h3" ta="center">
              Este tablero todavía no tiene listas
            </Title>
            <Text c="dimmed" size="md" ta="center">
              Creá tu primera lista (p. ej. "Por hacer") para empezar a
              organizar el trabajo.
            </Text>
          </Stack>
          <CreateListInlineForm boardId={boardId} />
        </Stack>
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDraggedCard(null)}
      >
        <div className={classes.canvas}>
          <SortableContext
            items={lists.map((list) => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            {lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                cards={visibleCardsByList[list.id] ?? []}
                totalCards={(cardsByList[list.id] ?? []).length}
                isFiltered={isFiltered}
                isLoadingCards={isLoadingCards}
                onOpenCard={onOpenCard}
                onMoveCardClick={setCardToMove}
              />
            ))}
          </SortableContext>
          <CreateListInlineForm boardId={boardId} />
        </div>

        {/*
          Sin overlay, `useSortable` deja de devolver transform en cuanto el
          cursor sale de la lista de origen (su `overIndex` pasa a -1 al medirse
          contra los ítems de ESA lista), y la tarjeta se congela en su lugar:
          el arrastre entre listas parecía no funcionar. La copia del overlay
          vive en un portal, así que además no la recorta el `overflow` de la
          columna ni el del canvas.
        */}
        <DragOverlay dropAnimation={null}>
          {draggedCard && <CardTileDragPreview card={draggedCard} />}
        </DragOverlay>
      </DndContext>

      {cardToMove && (
        <MoveCardModal
          card={cardToMove}
          lists={lists}
          cardsByList={cardsByList}
          opened={!!cardToMove}
          onClose={() => setCardToMove(null)}
        />
      )}
    </>
  )
}
