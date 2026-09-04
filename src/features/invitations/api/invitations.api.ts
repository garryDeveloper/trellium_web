import { httpClient } from '@/shared/api/http-client'
import type { Invitation } from '../types'

export async function listMyInvitations(): Promise<Invitation[]> {
  const { data } = await httpClient.get<{ invitations: Invitation[] }>(
    '/me/invitations',
  )
  return data.invitations
}

export async function acceptInvitation(invitationId: string): Promise<string> {
  const { data } = await httpClient.post<{ board: { id: string } }>(
    `/invitations/${invitationId}/accept`,
  )
  return data.board.id
}

export async function rejectInvitation(invitationId: string): Promise<void> {
  await httpClient.post(`/invitations/${invitationId}/reject`)
}
