import { updateUser } from '@saas/api-client';
import { useAuth } from '@saas/auth';
import type { UpdateUserInput } from '@saas/domain';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersKeys } from './queries';

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();
  const { user: currentUser, setUser } = useAuth();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(userId, input),
    onSuccess: async (updated) => {
      queryClient.setQueryData(usersKeys.detail(updated.id), updated);
      if (updated.id === currentUser?.id) setUser(updated);
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}
