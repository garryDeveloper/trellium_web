import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { Board } from '../types'

interface DeleteBoardConfirmModalProps {
  board: Board
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function DeleteBoardConfirmModal({
  board,
  opened,
  onClose,
  onConfirm,
  isPending,
}: DeleteBoardConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Eliminar tablero definitivamente"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          Vas a eliminar <b>{board.name}</b> de forma permanente, junto con
          todas sus listas y tarjetas. Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} autoFocus>
            Cancelar
          </Button>
          <Button color="danger" onClick={onConfirm} loading={isPending}>
            Eliminar definitivamente
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
