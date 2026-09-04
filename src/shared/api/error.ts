import { isAxiosError } from 'axios'

const GENERIC_ERROR_MESSAGE = 'Ocurrió un error. Intentá de nuevo.'

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.length > 0) {
      return message
    }
  }

  return GENERIC_ERROR_MESSAGE
}
