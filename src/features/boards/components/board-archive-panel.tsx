import { Center, Drawer, Loader, Stack, Tabs, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useState } from 'react'
import { useBoardLists } from '@/features/lists/hooks/use-board-lists'
import { useUnarchiveList } from '@/features/lists/hooks/use-unarchive-list'
import { useDeleteList } from '@/features/lists/hooks/use-delete-list'
import { ArchivedListRow } from '@/features/lists/components/archived-list-row'
import { DeleteListConfirmModal } from '@/features/lists/components/delete-list-confirm-modal'
import type { List } from '@/features/lists/types'
import { useBoardArchivedCards } from '@/features/cards/hooks/use-board-archived-cards'
import { ArchivedCardRow } from '@/features/cards/components/archived-card-row'

interface BoardArchivePanelProps {
  boardId: string
  opened: boolean
  onClose: () => void
}

export function BoardArchivePanel({
  boardId,
  opened,
  onClose,
}: BoardArchivePanelProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')

  const activeListsQuery = useBoardLists(opened ? boardId : undefined, 'active')
  const archivedListsQuery = useBoardLists(
    opened ? boardId : undefined,
    'archived',
  )
  const unarchiveListMutation = useUnarchiveList(boardId)
  const deleteListMutation = useDeleteList(boardId)
  const [listToDelete, setListToDelete] = useState<List | null>(null)

  const allLists = [
    ...(activeListsQuery.data ?? []),
    ...(archivedListsQuery.data ?? []),
  ]
  const { cards: archivedCards, isLoading: isLoadingArchivedCards } =
    useBoardArchivedCards(opened ? allLists : [])

  return (
    <>
      <Drawer
        opened={opened}
        onClose={onClose}
        position="right"
        title="Archivo del tablero"
        size={isMobile ? '100%' : 'md'}
      >
        <Tabs defaultValue="cards">
          <Tabs.List>
            <Tabs.Tab value="cards">Tarjetas</Tabs.Tab>
            <Tabs.Tab value="lists">Listas</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="cards" pt="md">
            <Stack gap="sm">
              {isLoadingArchivedCards && (
                <Center py="md">
                  <Loader size="sm" />
                </Center>
              )}

              {!isLoadingArchivedCards && archivedCards.length === 0 && (
                <Text c="dimmed" size="sm">
                  No hay tarjetas archivadas en este tablero.
                </Text>
              )}

              {archivedCards.map((card) => (
                <ArchivedCardRow key={card.id} card={card} />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="lists" pt="md">
            <Stack gap="sm">
              {archivedListsQuery.isLoading && (
                <Center py="md">
                  <Loader size="sm" />
                </Center>
              )}

              {archivedListsQuery.data?.length === 0 && (
                <Text c="dimmed" size="sm">
                  No hay listas archivadas en este tablero.
                </Text>
              )}

              {archivedListsQuery.data?.map((list) => (
                <ArchivedListRow
                  key={list.id}
                  list={list}
                  isRestoring={
                    unarchiveListMutation.isPending &&
                    unarchiveListMutation.variables === list.id
                  }
                  onRestore={() => unarchiveListMutation.mutate(list.id)}
                  onDeleteClick={() => setListToDelete(list)}
                />
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Drawer>

      {listToDelete && (
        <DeleteListConfirmModal
          list={listToDelete}
          opened={!!listToDelete}
          onClose={() => setListToDelete(null)}
          onConfirm={() =>
            deleteListMutation.mutate(listToDelete.id, {
              onSuccess: () => setListToDelete(null),
            })
          }
          isPending={deleteListMutation.isPending}
        />
      )}
    </>
  )
}
