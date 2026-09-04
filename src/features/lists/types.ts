export type ListStatus = 'active' | 'archived'

export interface List {
  id: string
  boardId: string
  name: string
  position: number
  status: ListStatus
  createdAt: string
}

export interface CreateListPayload {
  boardId: string
  name: string
}

export interface RenameListPayload {
  listId: string
  name: string
}

export interface ReorderListPayload {
  listId: string
  position: number
}
