import type { TocItemType } from '@/Toc/type';

export const mapItems = (items: TocItemType[]) =>
  items.map((item) => ({
    children: item.children?.map((child) => ({
      href: `#${child.id}`,
      key: child.id,
      title: child?.title,
    })),
    href: `#${item.id}`,
    key: item.id,
    title: item.title,
  }));
