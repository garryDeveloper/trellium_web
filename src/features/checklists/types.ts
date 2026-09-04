export interface ChecklistItem {
  id: string
  checklistId: string
  text: string
  completed: boolean
  position: number
}

export interface Checklist {
  id: string
  cardId: string
  name: string
  items: ChecklistItem[]
}

export interface ToggleChecklistItemPayload {
  itemId: string
  completed: boolean
}

export interface CreateChecklistPayload {
  cardId: string
  name: string
}

export interface AddChecklistItemPayload {
  checklistId: string
  text: string
}
