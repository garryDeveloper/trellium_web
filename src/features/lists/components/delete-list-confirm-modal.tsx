import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { List } from '../types'

interface DeleteListConfirmModalProps {
  list: List
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function DeleteListConfirmModal({
  list,
  opened,
  onClose,
  onConfirm,
  isPending,
}: DeleteListConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Eliminar lista definitivamente"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          Vas a eliminar <b>{list.name}</b> de forma permanente, junto con
          todas sus tarjetas. Esta acción no se puede deshacer.
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
