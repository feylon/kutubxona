import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const paginate = ({ page, limit }) => ({ offset: (page - 1) * limit, limit });

export const paged = ({ rows, count }, { page, limit }) => ({
  items: rows,
  total: count,
  page,
  limit,
  pages: Math.max(1, Math.ceil(count / limit)),
});
