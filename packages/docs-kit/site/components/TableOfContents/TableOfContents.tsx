import { ScrollArea, type ScrollAreaViewportProps } from '@lobehub/ui';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { springScrollToElement } from '../../lib/scroller';
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
        springScrollToElement(heading, -100);
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
  const [barOpen, setBarOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const barPanelId = useId();
  const reducedMotion = useReducedMotion();

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
      { rootMargin: '-96px 0px -66% 0px' },
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

  useEffect(() => {
    if (!barOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && barRef.current?.contains(event.target)) return;
      setBarOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setBarOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [barOpen]);

  if (items.length === 0) return null;

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <>
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
      <div className={styles.bar} ref={barRef}>
        <button
          aria-controls={barOpen ? barPanelId : undefined}
          aria-expanded={barOpen}
          className={styles.trigger}
          type="button"
          onClick={() => setBarOpen((open) => !open)}
        >
          <span className={styles.label}>On this page</span>
          <span className={styles.current}>{activeItem.title}</span>
          <ChevronDown aria-hidden className={styles.chevron} size={14} strokeWidth={1.8} />
        </button>
        <AnimatePresence initial={false}>
          {barOpen ? (
            <motion.nav
              animate={{ opacity: 1, y: 0 }}
              aria-label="On this page"
              className={styles.panel}
              exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.15 }, y: -8 }}
              id={barPanelId}
              initial={{ opacity: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <ScrollArea
                disableContentFit
                scrollFade
                className={styles.panelScroll}
                contentProps={{ className: styles.scrollContent }}
                scrollbarProps={{ className: styles.scrollbar }}
                viewportProps={{ className: styles.panelViewport }}
              >
                <TocList
                  activeId={activeId}
                  items={items}
                  onNavigate={(id) => {
                    setActiveId(id);
                    setBarOpen(false);
                  }}
                />
              </ScrollArea>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
