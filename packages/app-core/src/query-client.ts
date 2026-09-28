import { isApiError } from '@saas/api-client';
import { QueryClient } from '@tanstack/react-query';

const MAX_RETRIES = 2;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) =>
          failureCount < MAX_RETRIES &&
          !(isApiError(error) && error.status >= 400 && error.status < 500),
      },
    },
  });
}