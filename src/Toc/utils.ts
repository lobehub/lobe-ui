import { AnchorItem } from '@/Toc/TocMobile';

export const mapItems = (items: AnchorItem[]) =>
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
