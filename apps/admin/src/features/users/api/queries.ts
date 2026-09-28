import { getUsersList } from '@saas/api-client';
import type { ListUsersParams } from '@saas/domain';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: ListUsersParams) => [...usersKeys.lists(), params] as const,
};

export const usersQueries = {
  list: (params: ListUsersParams) =>
    queryOptions({
      queryKey: usersKeys.list(params),
      queryFn: ({ signal }) => getUsersList(params, signal),
      placeholderData: keepPreviousData,
    }),
};
