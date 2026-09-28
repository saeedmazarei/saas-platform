import { describe, expect, it } from 'vitest';
import { createMockDb } from './db';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
};

describe('createMockDb', () => {
  it('paginates users', () => {
    const db = createMockDb();
    const page = db.listUsers({ page: 2, pageSize: 10 });

    expect(page.items).toHaveLength(10);
    expect(page.page).toBe(2);
    expect(page.total).toBeGreaterThan(20);
  });

  it('filters by search term and role', () => {
    const db = createMockDb();
    const admins = db.listUsers({ page: 1, pageSize: 100, role: 'admin' });
    const byEmail = db.listUsers({ page: 1, pageSize: 100, search: 'ADMIN@example' });

    expect(admins.items.every((user) => user.role === 'admin')).toBe(true);
    expect(byEmail.items.map((user) => user.email)).toEqual(['admin@example.com']);
  });

  it('keeps updates in storage between instances', () => {
    const storage = memoryStorage();
    createMockDb({ storage }).updateUser('u-2', { name: 'Renamed' });

    expect(createMockDb({ storage }).getUser('u-2')?.name).toBe('Renamed');
  });
});
