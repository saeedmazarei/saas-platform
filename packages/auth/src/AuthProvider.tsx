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

  useEffect(() => {
    if (!sessionStore.getAccessToken()) return;
    getMe()
      .then(sessionStore.updateUser)
      .catch(() => {});
  }, []);

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