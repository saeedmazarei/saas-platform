import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import type { FeatureModule } from '@saas/app-core';

export const usersFeature: FeatureModule = {
  navItems: [{ label: 'Users', to: '/users', icon: <PeopleIcon /> }],
  routes: [
    {
      path: 'users',
      children: [
        {
          index: true,
          lazy: () => import('./pages/UsersListPage').then((m) => ({ Component: m.UsersListPage })),
        },
      ],
    },
  ],
};
