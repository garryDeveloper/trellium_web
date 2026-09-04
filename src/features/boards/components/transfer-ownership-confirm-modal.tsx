import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { BoardMember } from '../types'

interface TransferOwnershipConfirmModalProps {
  member: BoardMember
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function TransferOwnershipConfirmModal({
  member,
  opened,
  onClose,
  onConfirm,
  isPending,
}: TransferOwnershipConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Transferir propiedad del tablero"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          <b>{member.name}</b> pasará a ser el nuevo propietario del tablero y
          vos quedarás como miembro. Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} autoFocus>
            Cancelar
          </Button>
          <Button onClick={onConfirm} loading={isPending}>
            Transferir propiedad
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
