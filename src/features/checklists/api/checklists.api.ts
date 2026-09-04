import { httpClient } from '@/shared/api/http-client'
import type {
  AddChecklistItemPayload,
  Checklist,
  ChecklistItem,
  CreateChecklistPayload,
  ToggleChecklistItemPayload,
} from '../types'

export async function listCardChecklists(
  cardId: string,
): Promise<Checklist[]> {
  const { data } = await httpClient.get<{ checklists: Checklist[] }>(
    `/cards/${cardId}/checklists`,
  )
  return data.checklists
}

export async function createChecklist({
  cardId,
  name,
}: CreateChecklistPayload): Promise<Checklist> {
  const { data } = await httpClient.post<Checklist>(
    `/cards/${cardId}/checklists`,
    { name },
  )
  return data
}

export async function addChecklistItem({
  checklistId,
  text,
}: AddChecklistItemPayload): Promise<ChecklistItem> {
  const { data } = await httpClient.post<ChecklistItem>(
    `/checklists/${checklistId}/items`,
    { text },
  )
  return data
}

export async function toggleChecklistItem({
  itemId,
  completed,
}: ToggleChecklistItemPayload): Promise<ChecklistItem> {
  const { data } = await httpClient.patch<ChecklistItem>(
    `/checklist-items/${itemId}`,
    { completed },
  )
  return data
}

export async function deleteChecklistItem(itemId: string): Promise<void> {
  await httpClient.delete(`/checklist-items/${itemId}`)
}

export async function deleteChecklist(checklistId: string): Promise<void> {
  await httpClient.delete(`/checklists/${checklistId}`)
}
