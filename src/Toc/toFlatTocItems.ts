import type { AnchorItem } from '../Anchor';
import type { TocItem } from './type';

export interface FlatTocItem {
  href: string;
  id: string;
  key: string;
  level: 2 | 3;
  title: string;
}

const hrefToId = (href: string) => {
  const hash = href.includes('#') ? href.split('#').at(-1) : href.replace(/^#/, '');
  if (!hash) return '';
  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
};

/**
 * Normalize Anchor tree or flat TocItem[] into a flat outline.
 */
export const toFlatTocItems = (items: AnchorItem[] | TocItem[] = []): FlatTocItem[] => {
  if (!items.length) return [];

  const first = items[0] as TocItem & { level?: number };
  if (typeof first.level === 'number') {
    return (items as TocItem[]).flatMap((item, index) => {
      const id = hrefToId(item.href);
      if (!id || !item.title) return [];
      return [
        {
          href: item.href.startsWith('#') ? item.href : `#${id}`,
          id,
          key: String(index + 1),
          level: item.level === 3 ? 3 : 2,
          title: String(item.title),
        } satisfies FlatTocItem,
      ];
    });
  }

  return (items as AnchorItem[]).flatMap((item, index) => {
    const id = hrefToId(item.href);
    const top: FlatTocItem[] = id
      ? [
          {
            href: item.href.startsWith('#') ? item.href : `#${id}`,
            id,
            key: item.key ?? String(index + 1),
            level: 2,
            title: String(item.title ?? ''),
          },
        ]
      : [];
    const children = (item.children ?? []).flatMap((child, childIndex) => {
      const childId = hrefToId(child.href);
      if (!childId) return [];
      return [
        {
          href: child.href.startsWith('#') ? child.href : `#${childId}`,
          id: childId,
          key: child.key ?? `${item.key ?? index}-${childIndex}`,
          level: 3 as const,
          title: String(child.title ?? ''),
        },
      ];
    });
    return [...top, ...children];
  });
};
