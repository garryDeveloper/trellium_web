import { httpClient } from '@/shared/api/http-client'
import type { SearchParams, SearchResults } from '../types'

export async function search({
  q,
  includeArchived,
}: SearchParams): Promise<SearchResults> {
  const { data } = await httpClient.get<SearchResults>('/search', {
    params: { q, includeArchived },
  })
  return data
}
