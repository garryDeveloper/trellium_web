import { httpClient } from '@/shared/api/http-client'
import type {
  Board,
  BoardListItem,
  BoardStatus,
  CreateBoardPayload,
  RenameBoardPayload,
  TransferOwnershipPayload,
} from '../types'

export async function listBoards(status: BoardStatus): Promise<BoardListItem[]> {
  const { data } = await httpClient.get<{ boards: BoardListItem[] }>(
    '/boards',
    { params: { status } },
  )
  return data.boards
}

export async function createBoard(payload: CreateBoardPayload): Promise<Board> {
  const { data } = await httpClient.post<Board>('/boards', payload)
  return data
}

export async function renameBoard({
  boardId,
  name,
}: RenameBoardPayload): Promise<Board> {
  const { data } = await httpClient.patch<Board>(`/boards/${boardId}`, {
    name,
  })
  return data
}

export async function archiveBoard(boardId: string): Promise<Board> {
  const { data } = await httpClient.post<Board>(`/boards/${boardId}/archive`)
  return data
}

export async function unarchiveBoard(boardId: string): Promise<Board> {
  const { data } = await httpClient.post<Board>(
    `/boards/${boardId}/unarchive`,
  )
  return data
}

export async function deleteBoard(boardId: string): Promise<void> {
  await httpClient.delete(`/boards/${boardId}`)
}

export async function transferOwnership({
  boardId,
  newOwnerId,
}: TransferOwnershipPayload): Promise<Board> {
  const { data } = await httpClient.post<Board>(
    `/boards/${boardId}/transfer-ownership`,
    { newOwnerId },
  )
  return data
}
