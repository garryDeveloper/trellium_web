export const LABEL_COLOR_PALETTE = [
  '#B7E4C7', // verde
  '#FDE68A', // amarillo
  '#FCD3A2', // naranja
  '#FCA5A5', // rojo
  '#F5C2E7', // rosa
  '#DDD6FE', // morado
  '#BFDBFE', // azul
  '#D9D9D6', // gris
] as const

export const LABEL_COLOR_NAMES: Record<string, string> = {
  '#B7E4C7': 'Verde',
  '#FDE68A': 'Amarillo',
  '#FCD3A2': 'Naranja',
  '#FCA5A5': 'Rojo',
  '#F5C2E7': 'Rosa',
  '#DDD6FE': 'Morado',
  '#BFDBFE': 'Azul',
  '#D9D9D6': 'Gris',
}

export interface Label {
  id: string
  boardId: string
  name: string
  color: string
}

export interface CreateLabelPayload {
  boardId: string
  name: string
  color: string
}

export interface UpdateLabelPayload {
  labelId: string
  name?: string
  color?: string
}
