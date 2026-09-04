import {
  Button,
  Center,
  Group,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useBoards } from '../hooks/use-boards'
import type { BoardStatus } from '../types'
import { BoardCard } from '../components/board-card'
import { BoardsEmptyState } from '../components/boards-empty-state'
import { CreateBoardModal } from '../components/create-board-modal'
import { useMyInvitations } from '@/features/invitations/hooks/use-my-invitations'
import { PendingInvitations } from '@/features/invitations/components/pending-invitations'
import { PageContainer } from '@/app/page-container'

export function BoardsPage() {
  const [status, setStatus] = useState<BoardStatus>('active')
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false)
  const boardsQuery = useBoards(status)
  const invitationsQuery = useMyInvitations()

  const boards = boardsQuery.data ?? []
  const invitations = invitationsQuery.data ?? []
  const isEmpty =
    !boardsQuery.isLoading &&
    !invitationsQuery.isLoading &&
    boards.length === 0 &&
    (status === 'archived' || invitations.length === 0)

  return (
    <PageContainer>
      <Stack gap="xl">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Stack gap={2}>
          <Title order={1}>Mis tableros</Title>
          <Text c="dimmed" size="sm">
            Tableros donde sos propietario o miembro.
          </Text>
        </Stack>
        <Group gap="sm">
          <SegmentedControl
            value={status}
            onChange={(value) => setStatus(value as BoardStatus)}
            data={[
              { label: 'Activos', value: 'active' },
              { label: 'Archivados', value: 'archived' },
            ]}
          />
          {status === 'active' && (
            <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
              Crear tablero
            </Button>
          )}
        </Group>
      </Group>

      {status === 'active' && <PendingInvitations invitations={invitations} />}

      {boardsQuery.isLoading && (
        <Center py={80}>
          <Loader />
        </Center>
      )}

      {isEmpty && status === 'active' && (
        <BoardsEmptyState onCreate={openCreate} />
      )}

      {isEmpty && status === 'archived' && (
        <Center py={80}>
          <Text c="dimmed">No tenés tableros archivados.</Text>
        </Center>
      )}

      {!boardsQuery.isLoading && boards.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </SimpleGrid>
      )}

      <CreateBoardModal opened={createOpened} onClose={closeCreate} />
      </Stack>
    </PageContainer>
  )
}
