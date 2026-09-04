import { httpClient } from '@/shared/api/http-client'
import type {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '../types'

export async function listCardComments(cardId: string): Promise<Comment[]> {
  const { data } = await httpClient.get<{ comments: Comment[] }>(
    `/cards/${cardId}/comments`,
  )
  return data.comments
}

export async function createComment({
  cardId,
  body,
}: CreateCommentPayload): Promise<Comment> {
  const { data } = await httpClient.post<Comment>(
    `/cards/${cardId}/comments`,
    { body },
  )
  return data
}

export async function updateComment({
  commentId,
  body,
}: UpdateCommentPayload): Promise<Comment> {
  const { data } = await httpClient.patch<Comment>(`/comments/${commentId}`, {
    body,
  })
  return data
}

export async function deleteComment(commentId: string): Promise<void> {
  await httpClient.delete(`/comments/${commentId}`)
}
