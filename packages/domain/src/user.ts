import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'user']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userStatusSchema = z.enum(['active', 'suspended']);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: userRoleSchema,
  status: userStatusSchema,
  jobTitle: z.string(),
  bio: z.string(),
  createdAt: z.iso.datetime(),
});
export type User = z.infer<typeof userSchema>;