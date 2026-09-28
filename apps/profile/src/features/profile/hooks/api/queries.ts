import { getMyProfile } from '@saas/api-client';
import { queryOptions } from '@tanstack/react-query';

export const profileKeys = {
  me: ['profile', 'me'] as const,
};

export const profileQueries = {
  me: () =>
    queryOptions({
      queryKey: profileKeys.me,
      queryFn: ({ signal }) => getMyProfile(signal),
    }),
};
