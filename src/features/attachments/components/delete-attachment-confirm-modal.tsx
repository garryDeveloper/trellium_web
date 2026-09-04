import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { Attachment } from '../types'

interface DeleteAttachmentConfirmModalProps {
  attachment: Attachment
  /** El propietario del tablero moderando un adjunto ajeno. */
  isModerating: boolean
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

/**
 * Eliminar un adjunto borra el archivo del servidor y no se puede deshacer, así
 * que va con modal bloqueante y foco inicial en "Cancelar"
 * (`ui-guidelines.md` → confirmaciones destructivas).
 */
export function DeleteAttachmentConfirmModal({
  attachment,
  isModerating,
  opened,
  onClose,
  onConfirm,
  isPending,
}: DeleteAttachmentConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Eliminar adjunto" centered>
      <Stack gap="md">
        <Text size="sm">
          Vas a eliminar <b>{attachment.filename}</b>
          {isModerating ? (
            <>
              , subido por {attachment.uploadedBy.name}.
            </>
          ) : (
            '.'
          )}{' '}
          Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} autoFocus>
            Cancelar
          </Button>
          <Button color="danger" onClick={onConfirm} loading={isPending}>
            Eliminar adjunto
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
