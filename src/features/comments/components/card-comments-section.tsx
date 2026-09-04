import { Loader, Stack, Text } from '@mantine/core'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useBoard } from '@/features/boards/hooks/use-board'
import { CommentComposer } from './comment-composer'
import { CommentItem } from './comment-item'
import { useCardComments } from '../hooks/use-card-comments'
import { useCreateComment } from '../hooks/use-create-comment'
import { useUpdateComment } from '../hooks/use-update-comment'
import { useDeleteComment } from '../hooks/use-delete-comment'

interface CardCommentsSectionProps {
  cardId: string
  boardId: string
}

export function CardCommentsSection({
  cardId,
  boardId,
}: CardCommentsSectionProps) {
  const user = useAuthStore((state) => state.user)
  // El propietario del tablero puede eliminar comentarios ajenos, pero no
  // editarlos (T8.2).
  const { board } = useBoard(boardId)
  const isBoardOwner = !!user && board?.ownerId === user.id

  const commentsQuery = useCardComments(cardId)
  const createMutation = useCreateComment(cardId)
  const updateMutation = useUpdateComment(cardId)
  const deleteMutation = useDeleteComment(cardId)

  const comments = commentsQuery.data ?? []

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>
        Comentarios
      </Text>

      {commentsQuery.isLoading && <Loader size="xs" />}

      {!commentsQuery.isLoading && comments.length === 0 && (
        <Text size="sm" c="dimmed">
          Todavía no hay comentarios. Empezá la conversación.
        </Text>
      )}

      {/* La API ya los devuelve en orden cronológico. */}
      {comments.length > 0 && (
        <Stack gap="md">
          {comments.map((comment) => {
            const isAuthor = comment.author.id === user?.id

            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                canEdit={isAuthor}
                canDelete={isAuthor || isBoardOwner}
                isModerating={!isAuthor}
                isEditing={
                  updateMutation.isPending &&
                  updateMutation.variables?.commentId === comment.id
                }
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === comment.id
                }
                onEdit={(body) =>
                  updateMutation.mutate({ commentId: comment.id, body })
                }
                onDelete={() => deleteMutation.mutate(comment.id)}
              />
            )
          })}
        </Stack>
      )}

      <CommentComposer
        isPending={createMutation.isPending}
        onPublish={(body) => createMutation.mutate({ cardId, body })}
      />
    </Stack>
  )
}
