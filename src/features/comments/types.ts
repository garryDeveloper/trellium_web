import type { UserSummary } from '@/shared/types/api'

export interface Comment {
  id: string
  cardId: string
  body: string
  author: UserSummary
  createdAt: string
}

export interface CreateCommentPayload {
  cardId: string
  body: string
}

export interface UpdateCommentPayload {
  commentId: string
  body: string
}
