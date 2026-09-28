import type { NavItem } from '@saas/ui';
import type { RouteObject } from 'react-router';

export type FeatureModule = {
  routes: RouteObject[];
  navItems?: NavItem[];
};