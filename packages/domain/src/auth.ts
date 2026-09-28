import { z } from 'zod';
import { userSchema } from './user';

export const loginSchema = z.object({
  email: z.email('emailInvalid'),
  password: z.string().min(1, 'passwordRequired'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const sessionSchema = z.object({
  accessToken: z.string().min(1),
  user: userSchema,
});
export type Session = z.infer<typeof sessionSchema>;