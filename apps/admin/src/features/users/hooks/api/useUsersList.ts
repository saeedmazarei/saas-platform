import type { ListUsersParams } from '@saas/domain';
import { useQuery } from '@tanstack/react-query';
import { usersQueries } from './queries';

export function useUsersList(params: ListUsersParams) {
  return useQuery(usersQueries.list(params));
}
