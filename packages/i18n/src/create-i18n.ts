import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * All texts, grouped by namespace. Every package and every feature owns one namespace,
 * e.g. { users: { title: 'Users', ... } }. The app is English only for now; another language
 * would add a second set of the same files.
 */
export type Translations = Record<string, Record<string, unknown>>;

/** Creates the app's i18n instance from the texts of all its packages and features. */
export function createI18n(translations: Translations) {
  const i18n = i18next.createInstance();
  void i18n.use(initReactI18next).init({
    resources: { en: translations },
    lng: 'en',
    ns: Object.keys(translations),
    interpolation: { escapeValue: false }, // React already escapes values
    initAsync: false, // the texts are bundled, so there is nothing to wait for
  });
  return i18n;
}

export type I18n = ReturnType<typeof createI18n>;
