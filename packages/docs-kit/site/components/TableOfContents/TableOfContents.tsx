import { ScrollArea, type ScrollAreaViewportProps } from '@lobehub/ui';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getScrollContainer,
  HEADING_SCROLL_OFFSET,
  springScrollToElement,
} from '../../lib/scroller';
import { styles } from './style';

interface TableOfContentsProps {
  contentId: string;
  scopeKey: string;
}

interface TableOfContentsItem {
  id: string;
  level: 2 | 3;
  title: string;
}

interface TocListProps {
  activeId: string | undefined;
  items: TableOfContentsItem[];
  onNavigate: (id: string) => void;
}

function TocList({ activeId, items, onNavigate }: TocListProps) {
  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      const heading = document.getElementById(id);
      if (heading) {
        springScrollToElement(heading, HEADING_SCROLL_OFFSET);
      }
      onNavigate(id);
    },
    [onNavigate],
  );

  return (
    <ol>
      {items.map((item) => (
        <li data-level={item.level} key={item.id}>
          <a
            aria-current={item.id === activeId ? 'location' : undefined}
            href={`#${item.id}`}
            onClick={(event) => handleClick(event, item.id)}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({ contentId, scopeKey }: TableOfContentsProps) {
  const [items, setItems] = useState<TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) {
      setItems([]);
      return;
    }

    const headings = Array.from(content.querySelectorAll<HTMLHeadingElement>('h2, h3')).filter(
      (heading) => !heading.closest('[data-toc-ignore]'),
    );
    const nextItems = headings.flatMap((heading) => {
      const title = heading.textContent?.trim();
      if (!title || !heading.id) return [];

      return [
        {
          id: heading.id,
          level: heading.tagName === 'H3' ? 3 : 2,
          title,
        } satisfies TableOfContentsItem,
      ];
    });
    setItems(nextItems);
    setActiveId(nextItems[0]?.id);
  }, [contentId, scopeKey]);

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const headings = items.flatMap((item) => {
      const heading = document.getElementById(item.id);
      return heading ? [heading] : [];
    });
    if (headings.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = headings.find((heading) => visible.has(heading.id));
        if (first) setActiveId(first.id);
      },
      {
        root: getScrollContainer(),
        rootMargin: '-96px 0px -66% 0px',
      },
    );
    for (const heading of headings) observer.observe(heading);

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !activeId) return;

    const link = viewport.querySelector<HTMLElement>('a[aria-current]');
    if (!link) return;

    const viewportRect = viewport.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.top < viewportRect.top) {
      viewport.scrollTop += linkRect.top - viewportRect.top - 8;
    } else if (linkRect.bottom > viewportRect.bottom) {
      viewport.scrollTop += linkRect.bottom - viewportRect.bottom + 8;
    }
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <aside className={styles.root}>
      <nav aria-label="On this page">
        <h2>On this page</h2>
        <ScrollArea
          disableContentFit
          scrollFade
          className={styles.scrollArea}
          contentProps={{ className: styles.scrollContent }}
          scrollbarProps={{ className: styles.scrollbar }}
          viewportProps={
            {
              'className': styles.viewport,
              'data-toc-viewport': '',
              'ref': viewportRef,
            } as ScrollAreaViewportProps
          }
        >
          <TocList activeId={activeId} items={items} onNavigate={setActiveId} />
        </ScrollArea>
      </nav>
    </aside>
  );
}
