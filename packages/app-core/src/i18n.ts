import { authTranslations } from '@saas/auth';
import { validationTranslations } from '@saas/domain';
import { createI18n, type Translations } from '@saas/i18n';
import { uiTranslations } from '@saas/ui';
import type { FeatureModule } from './feature';
import core from './locales/en.json';

/** Texts of the shared packages, which every app needs. */
const platformTranslations: Translations = {
  ...validationTranslations,
  ...uiTranslations,
  ...authTranslations,
  core,
};

/**
 * Creates the app's i18n from the shared packages, the app's own texts and the texts of each
 * feature. A feature brings its texts with it, just like its routes.
 */
export function createAppI18n(features: FeatureModule[], appTranslations: Translations) {
  return createI18n(
    Object.assign({}, platformTranslations, appTranslations, ...features.map((feature) => feature.translations)),
  );
}
