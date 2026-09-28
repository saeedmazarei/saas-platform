import { z } from 'zod';

/** Environment variables are checked at startup, so a wrong config fails immediately with a clear message. */
const envSchema = z.object({
  VITE_API_URL: z.string().min(1).default('/api'),
  VITE_ENABLE_MOCKS: z.stringbool().default(false),
  VITE_ADMIN_APP_URL: z.url().default('http://localhost:5173'),
});

export const env = envSchema.parse(import.meta.env);
