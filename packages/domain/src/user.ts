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

const nameField = z.string().trim().min(2, 'Name must be at least 2 characters').max(80);
const jobTitleField = z.string().trim().max(80, 'Job title is too long');

export const updateUserSchema = z.object({
  name: nameField,
  email: z.email('Enter a valid email address'),
  role: userRoleSchema,
  status: userStatusSchema,
  jobTitle: jobTitleField,
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = z.object({
  name: nameField,
  jobTitle: jobTitleField,
  bio: z.string().trim().max(500, 'Bio must be at most 500 characters'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;