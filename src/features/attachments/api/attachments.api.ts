import { httpClient } from '@/shared/api/http-client'
import type { Attachment, UploadAttachmentPayload } from '../types'

export async function listCardAttachments(
  cardId: string,
): Promise<Attachment[]> {
  const { data } = await httpClient.get<{ attachments: Attachment[] }>(
    `/cards/${cardId}/attachments`,
  )
  return data.attachments
}

export async function uploadAttachment({
  cardId,
  file,
}: UploadAttachmentPayload): Promise<Attachment> {
  const form = new FormData()
  form.append('file', file)

  // Sin `Content-Type` a mano: axios tiene que poner el boundary del multipart.
  const { data } = await httpClient.post<Attachment>(
    `/cards/${cardId}/attachments`,
    form,
  )
  return data
}

/**
 * La descarga va con el token en el header, así que no puede ser un `<a href>`
 * suelto: se baja como blob y recién ahí se le pasa al navegador.
 */
export async function downloadAttachment(
  attachment: Attachment,
): Promise<void> {
  const { data } = await httpClient.get<Blob>(
    `/attachments/${attachment.id}/download`,
    { responseType: 'blob' },
  )

  const url = URL.createObjectURL(data)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = attachment.filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function deleteAttachment(attachmentId: string): Promise<void> {
  await httpClient.delete(`/attachments/${attachmentId}`)
}
