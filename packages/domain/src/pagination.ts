import { z } from 'zod';

export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  });

export type ListUsersParams = {
  page: number;
  pageSize: number;
  search?: string;
  role?: 'admin' | 'user';
};