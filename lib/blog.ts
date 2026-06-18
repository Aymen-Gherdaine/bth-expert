export const BLOG_PAGE_SIZE = 9;

export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number = BLOG_PAGE_SIZE
): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
  };
}
