import { httpClient } from '@/shared/api/http-client'
import type { User } from '@/shared/types/api'
import type { LoginPayload } from '../types'

export interface AuthResponse {
  user: User
  token: string
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function logout(): Promise<void> {
  await httpClient.post('/auth/logout')
}
