import { useQuery } from '@tanstack/react-query';
import { usersQueries } from './queries';

export function useUser(id: string) {
  return useQuery(usersQueries.detail(id));
}
