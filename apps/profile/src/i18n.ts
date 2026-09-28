import { createAppI18n } from '@saas/app-core';
import { features } from '@/router/features';
import app from './locales/en.json';

/** The app's i18n: shared packages + this app's own texts + the texts of every feature. */
export const createProfileI18n = () => createAppI18n(features, { app });
