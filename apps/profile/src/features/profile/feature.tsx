import PersonIcon from '@mui/icons-material/PersonOutlined';
import type { FeatureModule } from '@saas/app-core';
import profile from './locales/en.json';

export const profileFeature: FeatureModule = {
  navItems: [{ label: 'profile:menuLabel', to: '/profile', icon: <PersonIcon /> }],
  translations: { profile },
  routes: [
    {
      path: 'profile',
      lazy: () => import('./pages/ProfilePage').then((m) => ({ Component: m.ProfilePage })),
    },
  ],
};
