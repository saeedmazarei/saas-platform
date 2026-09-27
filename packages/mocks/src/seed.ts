import type { User } from '@saas/domain';

export const DEMO_PASSWORD = 'password123';

export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@example.com', password: DEMO_PASSWORD },
  user: { email: 'user@example.com', password: DEMO_PASSWORD },
} as const;

const FIRST_NAMES = ['Sara', 'Omid', 'Lena', 'Kian', 'Maya', 'Arash', 'Nora', 'Dario', 'Yara', 'Reza', 'Elif', 'Teo'];
const LAST_NAMES = ['Ahmadi', 'Berg', 'Costa', 'Doran', 'Farahani', 'Grant', 'Hosseini', 'Ito', 'Karimi', 'Larsen', 'Moradi', 'Novak'];
const JOB_TITLES = ['Product Manager', 'Software Engineer', 'Designer', 'Support Specialist', 'Data Analyst', 'Sales Lead'];

const pick = <T>(list: readonly T[], index: number): T => list[index % list.length]!;

export function createSeedUsers(): User[] {
  const users: User[] = [
    {
      id: 'u-1',
      name: 'Ada Admin',
      email: DEMO_ACCOUNTS.admin.email,
      role: 'admin',
      status: 'active',
      jobTitle: 'Platform Administrator',
      bio: 'Keeps the lights on.',
      createdAt: '2024-01-02T09:00:00.000Z',
    },
    {
      id: 'u-2',
      name: 'Uma User',
      email: DEMO_ACCOUNTS.user.email,
      role: 'user',
      status: 'active',
      jobTitle: 'Product Manager',
      bio: '',
      createdAt: '2024-01-03T09:00:00.000Z',
    },
  ];

  for (let i = 3; i <= 48; i++) {
    const first = pick(FIRST_NAMES, i);
    const last = pick(LAST_NAMES, i * 7);
    users.push({
      id: `u-${i}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${i}@example.com`.toLowerCase(),
      role: i % 9 === 0 ? 'admin' : 'user',
      status: i % 11 === 0 ? 'suspended' : 'active',
      jobTitle: pick(JOB_TITLES, i),
      bio: '',
      createdAt: new Date(Date.UTC(2024, i % 12, (i % 27) + 1, 9)).toISOString(),
    });
  }
  return users;
}