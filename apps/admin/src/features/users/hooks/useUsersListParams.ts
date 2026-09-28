import { userRoleSchema, type ListUsersParams } from '@saas/domain';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEFAULT_PAGE_SIZE = 10;

type ParamsPatch = Partial<Record<keyof ListUsersParams, string | number | undefined>>;

export function useUsersListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo<ListUsersParams>(() => {
    const pageSize = Number(searchParams.get('pageSize'));
    return {
      page: Math.max(1, Number(searchParams.get('page')) || 1),
      pageSize: PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
      search: searchParams.get('search') || undefined,
      role: userRoleSchema.safeParse(searchParams.get('role')).data,
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (patch: ParamsPatch) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === '') next.delete(key);
            else next.set(key, String(value));
          }
          if (!('page' in patch)) next.delete('page');
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [params, updateParams] as const;
}
