import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import type { Comment } from '../types'

interface DeleteCommentConfirmModalProps {
  comment: Comment
  /** El propietario del tablero modera comentarios ajenos: conviene decírselo. */
  isModerating: boolean
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

/**
 * Eliminar un comentario es irreversible, así que va con modal bloqueante y el
 * foco inicial en "Cancelar" (`ui-guidelines.md` → confirmaciones destructivas).
 */
export function DeleteCommentConfirmModal({
  comment,
  isModerating,
  opened,
  onClose,
  onConfirm,
  isPending,
}: DeleteCommentConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Eliminar comentario"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          {isModerating ? (
            <>
              Vas a eliminar el comentario de <b>{comment.author.name}</b>. Esta
              acción no se puede deshacer.
            </>
          ) : (
            <>Vas a eliminar tu comentario. Esta acción no se puede deshacer.</>
          )}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} autoFocus>
            Cancelar
          </Button>
          <Button color="danger" onClick={onConfirm} loading={isPending}>
            Eliminar comentario
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
