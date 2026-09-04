import { useQuery } from '@tanstack/react-query'
import { listMyInvitations } from '../api/invitations.api'

export function useMyInvitations() {
  return useQuery({
    queryKey: ['my-invitations'],
    queryFn: listMyInvitations,
  })
}
