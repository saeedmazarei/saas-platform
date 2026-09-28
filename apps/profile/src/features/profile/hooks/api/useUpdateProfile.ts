import { updateMyProfile } from '@saas/api-client';
import { useAuth } from '@saas/auth';
import type { UpdateProfileInput } from '@saas/domain';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileKeys } from './queries';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMyProfile(input),
    onSuccess: (user) => {
      queryClient.setQueryData(profileKeys.me, user);
      // The header shows the user's name, so update the session user as well.
      setUser(user);
    },
  });
}
