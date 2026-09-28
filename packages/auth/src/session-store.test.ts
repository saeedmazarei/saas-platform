import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sessionStore } from './session-store';

const session = {
  accessToken: 'mock-token.u-1',
  user: {
    id: 'u-1',
    name: 'Ada Admin',
    email: 'admin@example.com',
    role: 'admin' as const,
    status: 'active' as const,
    jobTitle: '',
    bio: '',
    createdAt: '2024-01-02T09:00:00.000Z',
  },
};

beforeEach(() => sessionStore.clear());

describe('sessionStore', () => {
  it('saves the session to localStorage and notifies listeners', () => {
    const listener = vi.fn();
    const unsubscribe = sessionStore.subscribe(listener);

    sessionStore.set(session);

    expect(sessionStore.getAccessToken()).toBe('mock-token.u-1');
    expect(JSON.parse(localStorage.getItem('saas.session') ?? 'null')).toEqual(session);
    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it('follows logins and logouts from other tabs', () => {
    window.dispatchEvent(new StorageEvent('storage', { key: 'saas.session', newValue: JSON.stringify(session) }));
    expect(sessionStore.getAccessToken()).toBe('mock-token.u-1');

    window.dispatchEvent(new StorageEvent('storage', { key: 'saas.session', newValue: null }));
    expect(sessionStore.getSession()).toBeNull();
  });
});
