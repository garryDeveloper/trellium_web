import { httpClient } from '@/shared/api/http-client'
import type { Activity } from '../types'

export async function listCardActivities(cardId: string): Promise<Activity[]> {
  const { data } = await httpClient.get<{ activities: Activity[] }>(
    `/cards/${cardId}/activities`,
  )
  return data.activities
}
