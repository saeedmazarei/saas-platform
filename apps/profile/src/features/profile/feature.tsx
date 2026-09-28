import PersonIcon from '@mui/icons-material/PersonOutlined';
import type { FeatureModule } from '@saas/app-core';

export const profileFeature: FeatureModule = {
  navItems: [{ label: 'Profile', to: '/profile', icon: <PersonIcon /> }],
  routes: [
    {
      path: 'profile',
      lazy: () => import('./pages/ProfilePage').then((m) => ({ Component: m.ProfilePage })),
    },
  ],
};
