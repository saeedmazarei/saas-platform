import { getMe, login as loginRequest, logout as logoutRequest } from '@saas/api-client';
import type { LoginInput, User } from '@saas/domain';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, use, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { sessionStore } from './session-store';

type AuthContextValue = {
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSession);
  const queryClient = useQueryClient();

  // On startup, check that the saved session is still valid (the token may have expired).
  // If the server answers 401, the axios setup clears the session.
  useEffect(() => {
    if (!sessionStore.getAccessToken()) return;
    getMe()
      .then(sessionStore.updateUser)
      .catch(() => {});
  }, []);

  // When the session ends, remove all cached server data,
  // so the next user never sees the previous user's data.
  useEffect(
    () =>
      sessionStore.subscribe(() => {
        if (!sessionStore.getSession()) queryClient.clear();
      }),
    [queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      login: async (input) => {
        const next = await loginRequest(input);
        queryClient.clear();
        sessionStore.set(next);
      },
      logout: async () => {
        // Log out locally even if the server call fails.
        await logoutRequest().catch(() => {});
        sessionStore.clear();
      },
      setUser: sessionStore.updateUser,
    }),
    [session, queryClient],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}