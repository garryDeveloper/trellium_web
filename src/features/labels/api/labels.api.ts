import { httpClient } from '@/shared/api/http-client'
import type { CreateLabelPayload, Label, UpdateLabelPayload } from '../types'

export async function listBoardLabels(boardId: string): Promise<Label[]> {
  const { data } = await httpClient.get<{ labels: Label[] }>(
    `/boards/${boardId}/labels`,
  )
  return data.labels
}

export async function createLabel({
  boardId,
  name,
  color,
}: CreateLabelPayload): Promise<Label> {
  const { data } = await httpClient.post<Label>(`/boards/${boardId}/labels`, {
    name,
    color,
  })
  return data
}

export async function updateLabel({
  labelId,
  name,
  color,
}: UpdateLabelPayload): Promise<Label> {
  const { data } = await httpClient.patch<Label>(`/labels/${labelId}`, {
    name,
    color,
  })
  return data
}

export async function deleteLabel(labelId: string): Promise<void> {
  await httpClient.delete(`/labels/${labelId}`)
}
