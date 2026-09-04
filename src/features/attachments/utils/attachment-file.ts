/**
 * Espejo de `attachment-policy.ts` en la API. Se repite acá para poder rechazar
 * antes de subir 10 MB al pedo y para poder filtrar el diálogo de archivos; la
 * validación que manda sigue siendo la del servidor.
 */
export const ALLOWED_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024

export const ALLOWED_ATTACHMENT_LABEL =
  'JPG, PNG, GIF, WEBP, PDF, TXT, CSV, DOCX, XLSX'

/** Para el `accept` del input: filtra el diálogo, no es una validación. */
export const ATTACHMENT_ACCEPT = ALLOWED_ATTACHMENT_TYPES.join(',')

export function isAllowedAttachmentType(mimeType: string): boolean {
  return (ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(mimeType)
}

/**
 * Devuelve el motivo del rechazo, o `null` si el archivo sirve. Se prefiere
 * mensaje explícito antes que un input que "no hace nada" (T8.3: rechazo con
 * mensaje claro).
 */
export function getAttachmentRejection(file: File): string | null {
  if (file.size === 0) {
    return 'El archivo está vacío.'
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return `"${file.name}" pesa ${formatBytes(file.size)} y el máximo es 10 MB.`
  }
  if (!isAllowedAttachmentType(file.type)) {
    return `El formato de "${file.name}" no está permitido. Se aceptan: ${ALLOWED_ATTACHMENT_LABEL}.`
  }
  return null
}

const UNITS = ['B', 'KB', 'MB', 'GB']

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  )
  const value = bytes / 1024 ** exponent
  // Los bytes enteros no llevan decimal; a partir de KB, uno solo alcanza.
  return `${exponent === 0 ? value : value.toFixed(1)} ${UNITS[exponent]}`
}
