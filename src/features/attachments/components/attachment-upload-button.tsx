import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPaperclip } from '@tabler/icons-react'
import { useRef } from 'react'
import {
  ATTACHMENT_ACCEPT,
  getAttachmentRejection,
} from '../utils/attachment-file'

interface AttachmentUploadButtonProps {
  isPending: boolean
  onUpload: (file: File) => void
}

export function AttachmentUploadButton({
  isPending,
  onUpload,
}: AttachmentUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    // Se valida acá además de en el servidor para no hacerle esperar una subida
    // de 10 MB a alguien que eligió el archivo equivocado.
    const rejection = getAttachmentRejection(file)
    if (rejection) {
      notifications.show({ message: rejection, color: 'danger' })
      return
    }
    onUpload(file)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ATTACHMENT_ACCEPT}
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          // Se limpia el input para que elegir dos veces el mismo archivo
          // vuelva a disparar el change.
          event.currentTarget.value = ''
          if (file) {
            handleFile(file)
          }
        }}
      />
      <Button
        variant="default"
        size="xs"
        leftSection={<IconPaperclip size={14} />}
        loading={isPending}
        onClick={() => inputRef.current?.click()}
      >
        Adjuntar archivo
      </Button>
    </>
  )
}
