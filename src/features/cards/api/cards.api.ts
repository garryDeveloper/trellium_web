import { httpClient } from '@/shared/api/http-client'
import type {
  ApplyLabelPayload,
  AssignMemberPayload,
  Card,
  CardStatus,
  CreateCardPayload,
  MoveCardPayload,
  RemoveLabelPayload,
  UnassignMemberPayload,
  UpdateCardPayload,
} from '../types'

export async function listCards(
  listId: string,
  status: CardStatus,
): Promise<Card[]> {
  const { data } = await httpClient.get<{ cards: Card[] }>(
    `/lists/${listId}/cards`,
    { params: { status } },
  )
  return data.cards
}

export async function createCard({
  listId,
  title,
}: CreateCardPayload): Promise<Card> {
  const { data } = await httpClient.post<Card>(`/lists/${listId}/cards`, {
    title,
  })
  return data
}

export async function updateCard({
  cardId,
  title,
  description,
  dueDate,
}: UpdateCardPayload): Promise<Card> {
  const { data } = await httpClient.patch<Card>(`/cards/${cardId}`, {
    title,
    description,
    dueDate,
  })
  return data
}

export async function moveCard({
  cardId,
  listId,
  position,
}: MoveCardPayload): Promise<Card> {
  const { data } = await httpClient.post<Card>(`/cards/${cardId}/move`, {
    listId,
    position,
  })
  return data
}

export async function assignMember({
  cardId,
  userId,
}: AssignMemberPayload): Promise<Card> {
  const { data } = await httpClient.post<Card>(`/cards/${cardId}/assignees`, {
    userId,
  })
  return data
}

export async function unassignMember({
  cardId,
  userId,
}: UnassignMemberPayload): Promise<Card> {
  const { data } = await httpClient.delete<Card>(
    `/cards/${cardId}/assignees/${userId}`,
  )
  return data
}

export async function applyLabel({
  cardId,
  labelId,
}: ApplyLabelPayload): Promise<Card> {
  const { data } = await httpClient.post<Card>(`/cards/${cardId}/labels`, {
    labelId,
  })
  return data
}

export async function removeLabel({
  cardId,
  labelId,
}: RemoveLabelPayload): Promise<Card> {
  const { data } = await httpClient.delete<Card>(
    `/cards/${cardId}/labels/${labelId}`,
  )
  return data
}

export async function archiveCard(cardId: string): Promise<Card> {
  const { data } = await httpClient.post<Card>(`/cards/${cardId}/archive`)
  return data
}

export async function unarchiveCard(cardId: string): Promise<Card> {
  const { data } = await httpClient.post<Card>(`/cards/${cardId}/unarchive`)
  return data
}

export async function deleteCard(cardId: string): Promise<void> {
  await httpClient.delete(`/cards/${cardId}`)
}
