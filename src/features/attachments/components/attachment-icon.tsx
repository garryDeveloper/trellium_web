import {
  IconFile,
  IconFileText,
  IconFileTypeCsv,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeXls,
  IconPhoto,
} from '@tabler/icons-react'

const ICONS: Record<string, typeof IconFile> = {
  'application/pdf': IconFileTypePdf,
  'text/csv': IconFileTypeCsv,
  'text/plain': IconFileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    IconFileTypeDocx,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    IconFileTypeXls,
}

/** El ícono es decorativo: el tipo real ya se lee en el nombre del archivo. */
export function AttachmentIcon({ mimeType }: { mimeType: string }) {
  const Icon =
    ICONS[mimeType] ?? (mimeType.startsWith('image/') ? IconPhoto : IconFile)

  return <Icon size={20} aria-hidden />
}
