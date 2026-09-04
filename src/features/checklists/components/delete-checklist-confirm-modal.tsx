import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { Checklist } from '../types'

interface DeleteChecklistConfirmModalProps {
  checklist: Checklist
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

/**
 * Borrar una checklist se lleva sus ítems por delante, así que va con
 * confirmación bloqueante; borrar un ítem suelto no (`ui-guidelines.md` →
 * confirmación proporcional al riesgo).
 */
export function DeleteChecklistConfirmModal({
  checklist,
  opened,
  onClose,
  onConfirm,
  isPending,
}: DeleteChecklistConfirmModalProps) {
  const itemCount = checklist.items.length

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Eliminar checklist"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          Vas a eliminar <b>{checklist.name}</b>
          {itemCount > 0
            ? ` junto con sus ${itemCount} ${itemCount === 1 ? 'ítem' : 'ítems'}.`
            : '.'}{' '}
          Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} autoFocus>
            Cancelar
          </Button>
          <Button color="danger" onClick={onConfirm} loading={isPending}>
            Eliminar checklist
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
