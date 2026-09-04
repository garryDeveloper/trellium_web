import { httpClient } from '@/shared/api/http-client'
import type {
  CreateListPayload,
  List,
  ListStatus,
  RenameListPayload,
  ReorderListPayload,
} from '../types'

export async function listBoardLists(
  boardId: string,
  status: ListStatus,
): Promise<List[]> {
  const { data } = await httpClient.get<{ lists: List[] }>(
    `/boards/${boardId}/lists`,
    { params: { status } },
  )
  return data.lists
}

export async function createList({
  boardId,
  name,
}: CreateListPayload): Promise<List> {
  const { data } = await httpClient.post<List>(`/boards/${boardId}/lists`, {
    name,
  })
  return data
}

export async function renameList({
  listId,
  name,
}: RenameListPayload): Promise<List> {
  const { data } = await httpClient.patch<List>(`/lists/${listId}`, { name })
  return data
}

export async function reorderList({
  listId,
  position,
}: ReorderListPayload): Promise<List> {
  const { data } = await httpClient.patch<List>(`/lists/${listId}`, {
    position,
  })
  return data
}

export async function archiveList(listId: string): Promise<List> {
  const { data } = await httpClient.post<List>(`/lists/${listId}/archive`)
  return data
}

export async function unarchiveList(listId: string): Promise<List> {
  const { data } = await httpClient.post<List>(`/lists/${listId}/unarchive`)
  return data
}

export async function deleteList(listId: string): Promise<void> {
  await httpClient.delete(`/lists/${listId}`)
}
