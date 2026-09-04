import { ActionIcon, Text, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconDownload, IconTrash } from '@tabler/icons-react'
import { AttachmentIcon } from './attachment-icon'
import { DeleteAttachmentConfirmModal } from './delete-attachment-confirm-modal'
import { formatBytes } from '../utils/attachment-file'
import type { Attachment } from '../types'
import classes from './attachment-row.module.css'

interface AttachmentRowProps {
  attachment: Attachment
  /** Quien lo subió, o el propietario del tablero (T8.3). */
  canDelete: boolean
  isModerating: boolean
  onDownload: () => void
  onDelete: () => void
  isDownloading: boolean
  isDeleting: boolean
}

export function AttachmentRow({
  attachment,
  canDelete,
  isModerating,
  onDownload,
  onDelete,
  isDownloading,
  isDeleting,
}: AttachmentRowProps) {
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false)

  return (
    <div className={classes.row}>
      <span className={classes.icon}>
        <AttachmentIcon mimeType={attachment.mimeType} />
      </span>

      <div className={classes.info}>
        <Text size="sm" fw={500} className={classes.name}>
          {attachment.filename}
        </Text>
        <Text size="xs" c="dimmed">
          {formatBytes(attachment.size)} · subido por{' '}
          {attachment.uploadedBy.name}
        </Text>
      </div>

      <div className={classes.actions}>
        <Tooltip label="Descargar">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={`Descargar ${attachment.filename}`}
            loading={isDownloading}
            onClick={onDownload}
          >
            <IconDownload size={16} />
          </ActionIcon>
        </Tooltip>

        {canDelete && (
          <Tooltip label="Eliminar">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label={
                isModerating
                  ? `Eliminar ${attachment.filename}, subido por ${attachment.uploadedBy.name}`
                  : `Eliminar ${attachment.filename}`
              }
              loading={isDeleting}
              onClick={openConfirm}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </div>

      {canDelete && (
        <DeleteAttachmentConfirmModal
          attachment={attachment}
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
