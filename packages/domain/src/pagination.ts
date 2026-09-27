import { z } from "zod";

export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  });

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ListUsersParams = {
  page: number;
  pageSize: number;
  search?: string;
  role?: "admin" | "user";
};
