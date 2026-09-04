import { Loader, Stack, Text } from '@mantine/core'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useBoard } from '@/features/boards/hooks/use-board'
import { AttachmentRow } from './attachment-row'
import { AttachmentUploadButton } from './attachment-upload-button'
import { useCardAttachments } from '../hooks/use-card-attachments'
import { useUploadAttachment } from '../hooks/use-upload-attachment'
import { useDeleteAttachment } from '../hooks/use-delete-attachment'
import { useDownloadAttachment } from '../hooks/use-download-attachment'
import { ALLOWED_ATTACHMENT_LABEL } from '../utils/attachment-file'

interface CardAttachmentsSectionProps {
  cardId: string
  boardId: string
}

export function CardAttachmentsSection({
  cardId,
  boardId,
}: CardAttachmentsSectionProps) {
  const user = useAuthStore((state) => state.user)
  // El propietario del tablero puede eliminar adjuntos ajenos (T8.3).
  const { board } = useBoard(boardId)
  const isBoardOwner = !!user && board?.ownerId === user.id

  const attachmentsQuery = useCardAttachments(cardId)
  const uploadMutation = useUploadAttachment(cardId)
  const deleteMutation = useDeleteAttachment(cardId)
  const downloadMutation = useDownloadAttachment()

  const attachments = attachmentsQuery.data ?? []

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>
        Adjuntos
      </Text>

      {attachmentsQuery.isLoading && <Loader size="xs" />}

      {!attachmentsQuery.isLoading && attachments.length === 0 && (
        <Text size="sm" c="dimmed">
          Sumá archivos relevantes para esta tarea. Hasta 10 MB (
          {ALLOWED_ATTACHMENT_LABEL}).
        </Text>
      )}

      {attachments.length > 0 && (
        <Stack gap="sm">
          {attachments.map((attachment) => {
            const isUploader = attachment.uploadedBy.id === user?.id

            return (
              <AttachmentRow
                key={attachment.id}
                attachment={attachment}
                canDelete={isUploader || isBoardOwner}
                isModerating={!isUploader}
                isDownloading={
                  downloadMutation.isPending &&
                  downloadMutation.variables?.id === attachment.id
                }
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === attachment.id
                }
                onDownload={() => downloadMutation.mutate(attachment)}
                onDelete={() => deleteMutation.mutate(attachment.id)}
              />
            )
          })}
        </Stack>
      )}

      <AttachmentUploadButton
        isPending={uploadMutation.isPending}
        onUpload={(file) => uploadMutation.mutate({ cardId, file })}
      />
    </Stack>
  )
}
