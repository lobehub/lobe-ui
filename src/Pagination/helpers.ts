export type PaginationItem = number | 'ellipsis-prev' | 'ellipsis-next';

export const getPageCount = (total: number, pageSize: number) =>
  Math.max(1, Math.ceil(total / pageSize));

export const clampPage = (page: number, pageCount: number) =>
  Math.min(Math.max(page, 1), pageCount);

export const getPaginationItems = (
  current: number,
  pageCount: number,
  buffer = 2,
): PaginationItem[] => {
  if (pageCount <= 1) return [1];

  const items: PaginationItem[] = [1];
  const start = Math.max(2, current - buffer);
  const end = Math.min(pageCount - 1, current + buffer);

  if (start > 2) items.push('ellipsis-prev');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < pageCount - 1) items.push('ellipsis-next');

  items.push(pageCount);

  return items;
};
