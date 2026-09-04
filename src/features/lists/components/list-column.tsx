import { useDroppable } from '@dnd-kit/core'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionIcon, Group, Loader, Menu } from '@mantine/core'
import {
  IconArchive,
  IconDotsVertical,
  IconGripVertical,
} from '@tabler/icons-react'
import { CardTile } from '@/features/cards/components/card-tile'
import { CreateCardInlineForm } from '@/features/cards/components/create-card-inline-form'
import type { Card } from '@/features/cards/types'
import type { List } from '../types'
import { useArchiveList } from '../hooks/use-archive-list'
import { ListNameInlineEdit } from './list-name-inline-edit'
import classes from './list-column.module.css'

interface ListColumnProps {
  list: List
  /** Tarjetas que sobreviven al filtro; son las que se renderizan. */
  cards: Card[]
  /** Tarjetas de la lista sin filtrar, para poder mostrar "visibles de total". */
  totalCards: number
  isFiltered: boolean
  isLoadingCards: boolean
  onOpenCard: (card: Card) => void
  onMoveCardClick: (card: Card) => void
}

export function ListColumn({
  list,
  cards,
  totalCards,
  isFiltered,
  isLoadingCards,
  onOpenCard,
  onMoveCardClick,
}: ListColumnProps) {
  const archiveMutation = useArchiveList(list.boardId)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: list.id, data: { type: 'list' } })
  const { setNodeRef: setDropzoneRef } = useDroppable({
    id: `list-dropzone-${list.id}`,
    data: { type: 'list-dropzone', listId: list.id },
  })

  return (
    <div
      ref={setNodeRef}
      className={`${classes.column}${isDragging ? ` ${classes.columnDragging}` : ''}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className={classes.header}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          aria-label={`Reordenar ${list.name}`}
          className={classes.grip}
          {...attributes}
          {...listeners}
        >
          <IconGripVertical size={14} />
        </ActionIcon>

        <div className={classes.name}>
          <ListNameInlineEdit list={list} />
        </div>

        {/* Con filtro puesto el contador dice "visibles de total": mostrar sólo
            el primero haría creer que la lista perdió tarjetas. */}
        <span
          className={classes.count}
          aria-label={
            isFiltered
              ? `${cards.length} de ${totalCards} tarjetas visibles`
              : `${cards.length} tarjetas`
          }
        >
          {isFiltered ? `${cards.length}/${totalCards}` : cards.length}
        </span>

        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label={`Opciones de ${list.name}`}
            >
              <IconDotsVertical size={14} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconArchive size={14} />}
              onClick={() => archiveMutation.mutate(list.id)}
            >
              Archivar lista
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <div ref={setDropzoneRef} className={classes.body}>
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {isLoadingCards && (
            <Group justify="center" py="md">
              <Loader size="xs" />
            </Group>
          )}

          {!isLoadingCards && cards.length === 0 && (
            <p className={classes.empty}>
              {isFiltered && totalCards > 0
                ? 'Ninguna coincide con el filtro'
                : 'Sin tarjetas todavía'}
            </p>
          )}

          {cards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              onOpen={() => onOpenCard(card)}
              onMoveToClick={() => onMoveCardClick(card)}
            />
          ))}
        </SortableContext>
      </div>

      <div className={classes.footer}>
        <CreateCardInlineForm listId={list.id} />
      </div>
    </div>
  )
}
