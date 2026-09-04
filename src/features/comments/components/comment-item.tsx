import { zodResolver } from '@hookform/resolvers/zod'
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DeleteCommentConfirmModal } from './delete-comment-confirm-modal'
import {
  commentBodySchema,
  type CommentBodyFormValues,
} from '../schemas/comment-body.schema'
import {
  formatCommentDate,
  formatCommentDateRelative,
} from '../utils/comment-date'
import type { Comment } from '../types'
import classes from './comment-item.module.css'

interface CommentItemProps {
  comment: Comment
  /** Solo el autor edita su propio comentario (T8.2). */
  canEdit: boolean
  /** El autor, o el propietario del tablero moderando (T8.2). */
  canDelete: boolean
  isModerating: boolean
  onEdit: (body: string) => void
  onDelete: () => void
  isEditing: boolean
  isDeleting: boolean
}

export function CommentItem({
  comment,
  canEdit,
  canDelete,
  isModerating,
  onEdit,
  onDelete,
  isEditing,
  isDeleting,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false)
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentBodyFormValues>({
    resolver: zodResolver(commentBodySchema),
    defaultValues: { body: comment.body },
  })

  const cancelEdit = () => {
    reset({ body: comment.body })
    setEditing(false)
  }

  const onSubmit = (values: CommentBodyFormValues) => {
    if (values.body === comment.body) {
      setEditing(false)
      return
    }
    onEdit(values.body)
    setEditing(false)
  }

  return (
    <div className={classes.item}>
      <Avatar
        name={comment.author.name}
        color="initials"
        radius="xl"
        size="sm"
      />

      <div className={classes.content}>
        <div className={classes.header}>
          <Text size="sm" fw={500} truncate>
            {comment.author.name}
          </Text>
          {/* La fecha original se conserva al editar (T8.2). */}
          <Tooltip label={formatCommentDate(comment.createdAt)}>
            <Text size="xs" c="dimmed">
              {formatCommentDateRelative(comment.createdAt)}
            </Text>
          </Tooltip>

          {(canEdit || canDelete) && !editing && (
            <div className={classes.actions}>
              {canEdit && (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  aria-label="Editar mi comentario"
                  onClick={() => setEditing(true)}
                >
                  <IconPencil size={14} />
                </ActionIcon>
              )}
              {canDelete && (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  aria-label={
                    isModerating
                      ? `Eliminar el comentario de ${comment.author.name}`
                      : 'Eliminar mi comentario'
                  }
                  loading={isDeleting}
                  onClick={openConfirm}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap="xs" mt={4}>
              <Textarea
                autoFocus
                size="sm"
                autosize
                minRows={2}
                maxRows={8}
                error={errors.body?.message}
                aria-label="Editar comentario"
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    cancelEdit()
                  }
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void handleSubmit(onSubmit)()
                  }
                }}
                {...register('body')}
              />
              <Group gap="xs" justify="flex-end">
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={cancelEdit}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="xs" loading={isEditing}>
                  Guardar
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          <Text size="sm" className={classes.body}>
            {comment.body}
          </Text>
        )}
      </div>

      {canDelete && (
        <DeleteCommentConfirmModal
          comment={comment}
          isModerating={isModerating}
          opened={confirmOpened}
          onClose={closeConfirm}
          onConfirm={() => {
            onDelete()
            closeConfirm()
          }}
          isPending={isDeleting}
        />
      )}
    </div>
  )
}
