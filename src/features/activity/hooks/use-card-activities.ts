import { useQuery } from '@tanstack/react-query'
import { listCardActivities } from '../api/activities.api'

export function cardActivitiesKey(cardId: string | undefined) {
  return ['activities', 'card', cardId] as const
}

export function useCardActivities(cardId: string | undefined) {
  return useQuery({
    queryKey: cardActivitiesKey(cardId),
    queryFn: () => listCardActivities(cardId as string),
    enabled: !!cardId,
  })
}
