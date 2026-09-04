import { httpClient } from '@/shared/api/http-client'
import type { BoardInvitation, BoardMember, InviteMemberPayload } from '../types'

export async function listBoardMembers(boardId: string): Promise<BoardMember[]> {
  const { data } = await httpClient.get<{ members: BoardMember[] }>(
    `/boards/${boardId}/members`,
  )
  return data.members
}

export async function removeMember(
  boardId: string,
  userId: string,
): Promise<void> {
  await httpClient.delete(`/boards/${boardId}/members/${userId}`)
}

export async function inviteMember({
  boardId,
  email,
}: InviteMemberPayload): Promise<void> {
  await httpClient.post(`/boards/${boardId}/invitations`, { email })
}

export async function listBoardInvitations(
  boardId: string,
): Promise<BoardInvitation[]> {
  const { data } = await httpClient.get<{ invitations: BoardInvitation[] }>(
    `/boards/${boardId}/invitations`,
  )
  return data.invitations
}

export async function cancelInvitation(
  boardId: string,
  invitationId: string,
): Promise<void> {
  await httpClient.delete(`/boards/${boardId}/invitations/${invitationId}`)
}
