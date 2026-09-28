import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import type { FeatureModule } from '@saas/app-core';
import users from './locales/en.json';

export const usersFeature: FeatureModule = {
  navItems: [{ label: 'users:menuLabel', to: '/users', icon: <PeopleIcon /> }],
  translations: { users },
  routes: [
    {
      path: 'users',
      children: [
        {
          index: true,
          lazy: () => import('./pages/UsersListPage').then((m) => ({ Component: m.UsersListPage })),
        },
        {
          path: ':userId',
          lazy: () => import('./pages/UserDetailsPage').then((m) => ({ Component: m.UserDetailsPage })),
        },
        {
          path: ':userId/edit',
          lazy: () => import('./pages/UserEditPage').then((m) => ({ Component: m.UserEditPage })),
        },
      ],
    },
  ],
};
