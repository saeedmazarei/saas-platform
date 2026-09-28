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

const nameField = z.string().trim().min(2, 'nameTooShort').max(80, 'nameTooLong');
const jobTitleField = z.string().trim().max(80, 'jobTitleTooLong');

export const updateUserSchema = z.object({
  name: nameField,
  email: z.email('emailInvalid'),
  role: userRoleSchema,
  status: userStatusSchema,
  jobTitle: jobTitleField,
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = z.object({
  name: nameField,
  jobTitle: jobTitleField,
  bio: z.string().trim().max(500, 'bioTooLong'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;