import { Badge, Button, Divider, Drawer, Group, Select, Stack, Text } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { Board } from '../types'
import { useArchiveBoard } from '../hooks/use-archive-board'
import { useUnarchiveBoard } from '../hooks/use-unarchive-board'
import { useDeleteBoard } from '../hooks/use-delete-board'
import { useBoardMembers } from '../hooks/use-board-members'
import { useTransferOwnership } from '../hooks/use-transfer-ownership'
import { DeleteBoardConfirmModal } from './delete-board-confirm-modal'
import { TransferOwnershipConfirmModal } from './transfer-ownership-confirm-modal'

interface BoardSettingsPanelProps {
  board: Board
  opened: boolean
  onClose: () => void
}

export function BoardSettingsPanel({
  board,
  opened,
  onClose,
}: BoardSettingsPanelProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const user = useAuthStore((state) => state.user)
  const isOwner = user?.id === board.ownerId

  const archiveMutation = useArchiveBoard()
  const unarchiveMutation = useUnarchiveBoard()
  const deleteMutation = useDeleteBoard()
  const [confirmDeleteOpened, { open: openConfirmDelete, close: closeConfirmDelete }] =
    useDisclosure(false)

  const membersQuery = useBoardMembers(isOwner ? board.id : undefined)
  const otherMembers = useMemo(
    () => membersQuery.data?.filter((member) => member.role !== 'owner') ?? [],
    [membersQuery.data],
  )
  const [newOwnerId, setNewOwnerId] = useState<string | null>(null)
  const transferOwnershipMutation = useTransferOwnership()
  const [confirmTransferOpened, { open: openConfirmTransfer, close: closeConfirmTransfer }] =
    useDisclosure(false)
  const selectedMember = otherMembers.find((member) => member.userId === newOwnerId)

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title="Configuración del tablero"
      size={isMobile ? '100%' : 'md'}
    >
      <Stack gap="xl">
        <Stack gap={4}>
          <Text size="sm" fw={500}>
            Nombre
          </Text>
          <Text size="sm" c="dimmed">
            Se edita haciendo click directo sobre el título del tablero.
          </Text>
        </Stack>

        <Divider />

        <Stack gap={8}>
          <Text size="sm" fw={500}>
            Estado
          </Text>
          <Group justify="space-between">
            <Badge color={board.status === 'active' ? 'success' : 'gray'} variant="light">
              {board.status === 'active' ? 'Activo' : 'Archivado'}
            </Badge>
            {isOwner ? (
              board.status === 'active' ? (
                <Button
                  variant="default"
                  size="xs"
                  loading={archiveMutation.isPending}
                  onClick={() => archiveMutation.mutate(board.id)}
                >
                  Archivar tablero
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="xs"
                  loading={unarchiveMutation.isPending}
                  onClick={() => unarchiveMutation.mutate(board.id)}
                >
                  Restaurar tablero
                </Button>
              )
            ) : (
              <Text size="xs" c="dimmed">
                Solo el propietario puede archivar o restaurar.
              </Text>
            )}
          </Group>
        </Stack>

        <Divider />

        <Stack gap={8}>
          <Text size="sm" fw={500}>
            Transferir propiedad
          </Text>
          {isOwner ? (
            otherMembers.length > 0 ? (
              <>
                <Text size="sm" c="dimmed">
                  Elegí un miembro del tablero para que pase a ser el nuevo
                  propietario.
                </Text>
                <Group gap="xs">
                  <Select
                    placeholder="Elegir miembro"
                    data={otherMembers.map((member) => ({
                      value: member.userId,
                      label: `${member.name} (${member.email})`,
                    }))}
                    value={newOwnerId}
                    onChange={setNewOwnerId}
                    w={260}
                  />
                  <Button
                    variant="default"
                    size="xs"
                    disabled={!newOwnerId}
                    onClick={openConfirmTransfer}
                  >
                    Transferir propiedad
                  </Button>
                </Group>
              </>
            ) : (
              <Text size="sm" c="dimmed">
                No hay otros miembros a quién transferir la propiedad.
              </Text>
            )
          ) : (
            <Text size="sm" c="dimmed">
              Solo el propietario puede transferir la propiedad.
            </Text>
          )}
        </Stack>

        {isOwner && (
          <>
            <Divider />
            <Stack gap={8}>
              <Text size="sm" fw={500} c="danger">
                Zona de peligro
              </Text>
              <Text size="sm" c="dimmed">
                {board.status === 'active'
                  ? 'Para eliminar el tablero definitivamente, primero archivalo.'
                  : 'Esta acción no se puede deshacer. Se eliminará el tablero y todo su contenido.'}
              </Text>
              <Button
                color="danger"
                variant="light"
                size="xs"
                w="fit-content"
                disabled={board.status !== 'archived'}
                onClick={openConfirmDelete}
              >
                Eliminar definitivamente
              </Button>
            </Stack>
          </>
        )}
      </Stack>

      <DeleteBoardConfirmModal
        board={board}
        opened={confirmDeleteOpened}
        onClose={closeConfirmDelete}
        onConfirm={() => deleteMutation.mutate(board.id)}
        isPending={deleteMutation.isPending}
      />

      {selectedMember && (
        <TransferOwnershipConfirmModal
          member={selectedMember}
          opened={confirmTransferOpened}
          onClose={closeConfirmTransfer}
          onConfirm={() =>
            transferOwnershipMutation.mutate(
              { boardId: board.id, newOwnerId: selectedMember.userId },
              {
                onSuccess: () => {
                  closeConfirmTransfer()
                  setNewOwnerId(null)
                },
              },
            )
          }
          isPending={transferOwnershipMutation.isPending}
        />
      )}
    </Drawer>
  )
}
