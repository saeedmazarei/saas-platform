import type { FeatureModule } from '@saas/app-core';
import { profileFeature } from '@/features/profile';

/** Every feature of the Profile app. A new feature is registered here with one line. */
export const features: FeatureModule[] = [profileFeature];
