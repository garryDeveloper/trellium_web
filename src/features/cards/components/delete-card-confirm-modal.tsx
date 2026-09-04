import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { Card } from '../types'

interface DeleteCardConfirmModalProps {
  card: Card
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function DeleteCardConfirmModal({
  card,
  opened,
  onClose,
  onConfirm,
  isPending,
}: DeleteCardConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Eliminar tarjeta definitivamente"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          Vas a eliminar <b>{card.title}</b> de forma permanente, junto con
          todo su contenido asociado. Esta acción no se puede deshacer.
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
