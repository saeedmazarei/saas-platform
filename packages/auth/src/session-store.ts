import type { Session, User } from '@saas/domain';

const STORAGE_KEY = 'saas.session';

let session: Session | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function write(next: Session | null) {
  session = next;
  if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  else localStorage.removeItem(STORAGE_KEY);
  notify();
}

window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY) return;
  session = JSON.parse(event.newValue ?? 'null');
  notify();
});

export const sessionStore = {
  getSession: () => session,
  getAccessToken: () => session?.accessToken ?? null,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  set: (next: Session) => write(next),
  clear: () => write(null),
  updateUser: (user: User) => {
    if (session) write({ ...session, user });
  },
};