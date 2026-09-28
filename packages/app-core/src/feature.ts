import type { Translations } from '@saas/i18n';
import type { NavItem } from '@saas/ui';
import type { RouteObject } from 'react-router';

export type FeatureModule = {
  routes: RouteObject[];
  navItems?: NavItem[];
  /** The feature's texts, one namespace named after the feature. */
  translations?: Translations;
};