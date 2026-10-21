import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getScrollContainer,
  HEADING_SCROLL_OFFSET,
  springScrollToElement,
} from '../../lib/scroller';
import { styles } from './style';
import { TocBar } from './TocBar';
import { TocOutline } from './TocOutline';
import { TocRail } from './TocRail';
import type { TocItem, TocViewProps } from './types';

interface TableOfContentsProps {
  contentId: string;
  headings?: TocItem[];
  scopeKey: string;
}

interface ScopedValue<T> {
  scopeKey: string;
  value: T;
}

const NO_ITEMS: TocItem[] = [];

const findParentId = (items: TocItem[], activeId: string | undefined) => {
  const index = items.findIndex((item) => item.id === activeId);
  if (index < 0 || items[index].level !== 3) return undefined;
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (items[cursor].level === 2) return items[cursor].id;
  }
  return undefined;
};

export function TableOfContents({ contentId, headings, scopeKey }: TableOfContentsProps) {
  const [scanned, setScanned] = useState<ScopedValue<TocItem[]>>();
  const [active, setActive] = useState<ScopedValue<string>>();

  const items = scanned?.scopeKey === scopeKey ? scanned.value : (headings ?? NO_ITEMS);
  const activeId =
    active?.scopeKey === scopeKey && items.some((item) => item.id === active.value)
      ? active.value
      : items[0]?.id;

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) return;

    const nodes = Array.from(content.querySelectorAll<HTMLHeadingElement>('h2, h3')).filter(
      (heading) => !heading.closest('[data-toc-ignore]'),
    );
    const nextItems = nodes.flatMap((heading) => {
      const title = heading.textContent?.trim();
      if (!title || !heading.id) return [];

      return [
        {
          id: heading.id,
          level: heading.tagName === 'H3' ? 3 : 2,
          title,
        } satisfies TocItem,
      ];
    });
    setScanned({ scopeKey, value: nextItems });
  }, [contentId, scopeKey]);

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const elements = items.flatMap((item) => {
      const heading = document.getElementById(item.id);
      return heading ? [heading] : [];
    });
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = elements.find((heading) => visible.has(heading.id));
        if (first) setActive({ scopeKey, value: first.id });
      },
      {
        root: getScrollContainer(),
        rootMargin: '-96px 0px -66% 0px',
      },
    );
    for (const heading of elements) observer.observe(heading);

    return () => observer.disconnect();
  }, [items, scopeKey]);

  const handleNavigate = useCallback(
    (id: string) => {
      const heading = document.getElementById(id);
      if (heading) springScrollToElement(heading, HEADING_SCROLL_OFFSET);
      setActive({ scopeKey, value: id });
    },
    [scopeKey],
  );

  const viewProps = useMemo<TocViewProps>(
    () => ({
      activeId,
      items,
      onNavigate: handleNavigate,
      parentId: findParentId(items, activeId),
    }),
    [activeId, handleNavigate, items],
  );

  if (items.length === 0) return null;

  return (
    <>
      <TocBar {...viewProps} />
      <aside data-docs-toc="" {...stylex.props(styles.aside)}>
        <TocOutline {...viewProps} />
        <TocRail {...viewProps} />
      </aside>
    </>
  );
}
