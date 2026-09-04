import type { UserSummary } from '@/shared/types/api'

export interface Invitation {
  id: string
  boardId: string
  boardName: string
  invitedEmail: string
  status: 'pending' | 'accepted' | 'rejected'
  invitedBy: UserSummary
  createdAt: string
}
