import type { ListUsersParams, Paginated, User } from '@saas/domain';
import { createSeedUsers } from './seed';

export type MockDbStorage = Pick<Storage, 'getItem' | 'setItem'>;

type UserPatch = Partial<Omit<User, 'id' | 'createdAt'>>;

export function createMockDb(options: { storage?: MockDbStorage; storageKey?: string } = {}) {
  const { storage, storageKey = 'saas.mock-db.v1' } = options;

  const load = (): User[] | null => {
    try {
      const raw = storage?.getItem(storageKey);
      return raw ? (JSON.parse(raw) as User[]) : null;
    } catch {
      return null;
    }
  };

  let users = load() ?? createSeedUsers();

  const save = () => storage?.setItem(storageKey, JSON.stringify(users));

  return {
    listUsers({ page, pageSize, search, role }: ListUsersParams): Paginated<User> {
      const term = search?.trim().toLowerCase();
      const filtered = users.filter(
        (user) =>
          (!role || user.role === role) &&
          (!term || user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)),
      );
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
    },

    getUser: (id: string) => users.find((user) => user.id === id),

    findUserByEmail: (email: string) =>
      users.find((user) => user.email.toLowerCase() === email.toLowerCase()),

    isEmailTaken: (email: string, exceptUserId: string) =>
      users.some((user) => user.id !== exceptUserId && user.email.toLowerCase() === email.toLowerCase()),

    updateUser(id: string, patch: UserPatch): User | undefined {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) return undefined;
      const updated: User = { ...users[index]!, ...patch };
      users = users.with(index, updated);
      save();
      return updated;
    },

    reset() {
      users = createSeedUsers();
      save();
    },
  };
}

export type MockDb = ReturnType<typeof createMockDb>;