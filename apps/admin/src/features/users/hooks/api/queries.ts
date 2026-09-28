import { getUser, getUsersList } from '@saas/api-client';
import type { ListUsersParams } from '@saas/domain';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: ListUsersParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

export const usersQueries = {
  list: (params: ListUsersParams) =>
    queryOptions({
      queryKey: usersKeys.list(params),
      queryFn: ({ signal }) => getUsersList(params, signal),
      placeholderData: keepPreviousData,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: usersKeys.detail(id),
      queryFn: ({ signal }) => getUser(id, signal),
    }),
};
