import type { UserSummary } from '@/shared/types/api'

export interface Attachment {
  id: string
  cardId: string
  filename: string
  mimeType: string
  /** Bytes. */
  size: number
  uploadedBy: UserSummary
  createdAt: string
}

export interface UploadAttachmentPayload {
  cardId: string
  file: File
}
