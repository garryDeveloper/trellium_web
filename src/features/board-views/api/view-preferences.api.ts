import { httpClient } from '@/shared/api/http-client'
import type { BoardViewPreferences } from '../types'

export async function getBoardViewPreferences(
  boardId: string,
): Promise<BoardViewPreferences> {
  const { data } = await httpClient.get<BoardViewPreferences>(
    `/boards/${boardId}/view-preferences`,
  )
  return data
}

export async function saveBoardViewPreferences(
  boardId: string,
  preferences: BoardViewPreferences,
): Promise<BoardViewPreferences> {
  const { data } = await httpClient.put<BoardViewPreferences>(
    `/boards/${boardId}/view-preferences`,
    preferences,
  )
  return data
}
