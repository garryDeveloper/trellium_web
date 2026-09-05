import { Group, Loader, SegmentedControl, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useBoard } from '@/features/boards/hooks/use-board'
import { CommentComposer } from '@/features/comments/components/comment-composer'
import { CommentItem } from '@/features/comments/components/comment-item'
import { useCardComments } from '@/features/comments/hooks/use-card-comments'
import { useCreateComment } from '@/features/comments/hooks/use-create-comment'
import { useDeleteComment } from '@/features/comments/hooks/use-delete-comment'
import { useUpdateComment } from '@/features/comments/hooks/use-update-comment'
import { useCardActivities } from '../hooks/use-card-activities'
import { buildTimeline } from '../utils/timeline'
import { ActivityItem } from './activity-item'

interface CardActivitySectionProps {
  cardId: string
  boardId: string
}

/**
 * Sección "Actividad" del detalle de tarjeta (T13.1): los comentarios y los
 * eventos de cambio en una sola línea de tiempo.
 *
 * Reemplaza a la sección de comentarios sola. Los dos tipos de fila conviven
 * porque responden la misma pregunta —"cómo llegó esto acá"—, y el control de
 * arriba deja quedarse sólo con la conversación cuando el historial es ruido.
 */
export function CardActivitySection({
  cardId,
  boardId,
}: CardActivitySectionProps) {
  const [filter, setFilter] = useState<'all' | 'comments'>('all')

  const user = useAuthStore((state) => state.user)
  // El propietario del tablero puede eliminar comentarios ajenos, pero no
  // editarlos (T8.2).
  const { board } = useBoard(boardId)
  const isBoardOwner = !!user && board?.ownerId === user.id

  const commentsQuery = useCardComments(cardId)
  const activitiesQuery = useCardActivities(cardId)
  const createMutation = useCreateComment(cardId)
  const updateMutation = useUpdateComment(cardId)
  const deleteMutation = useDeleteComment(cardId)

  const comments = commentsQuery.data ?? []
  const activities = activitiesQuery.data ?? []
  const timeline = buildTimeline(comments, activities, filter === 'all')

  const isLoading = commentsQuery.isLoading || activitiesQuery.isLoading

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500}>
          Actividad
        </Text>

        <SegmentedControl
          size="xs"
          value={filter}
          onChange={(value) => setFilter(value as 'all' | 'comments')}
          aria-label="Qué mostrar en la actividad"
          data={[
            { value: 'all', label: 'Todo' },
            { value: 'comments', label: 'Sólo comentarios' },
          ]}
        />
      </Group>

      {isLoading && <Loader size="xs" />}

      {!isLoading && timeline.length === 0 && (
        <Text size="sm" c="dimmed">
          {filter === 'comments'
            ? 'Todavía no hay comentarios. Empezá la conversación.'
            : 'Todavía no hay actividad en esta tarjeta.'}
        </Text>
      )}

      {timeline.length > 0 && (
        <Stack gap="md">
          {timeline.map((item) => {
            if (item.kind === 'activity') {
              return (
                <ActivityItem
                  key={item.id}
                  activity={item.activity}
                  currentUserId={user?.id}
                />
              )
            }

            const { comment } = item
            const isAuthor = comment.author.id === user?.id

            return (
              <CommentItem
                key={item.id}
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
