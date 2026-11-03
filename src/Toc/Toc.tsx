'use client';

import clsx from 'clsx';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { tocClasses } from './stable';
import { styles } from './style';
import { buildTocPath, type TocPath } from './tocPath';
import { type FlatTocItem, toFlatTocItems } from './toFlatTocItems';
import type { TocProps } from './type';

const EMPTY_PATH: TocPath = { d: '', length: 0, ranges: [] };
const DEFAULT_OFFSET = 96;
const SCROLL_LOCK_FALLBACK_MS = 1000;

type ScrollContainer = HTMLElement | Window;

const isWindow = (container: ScrollContainer): container is Window => container === window;

const getRelativeTop = (element: HTMLElement, container: ScrollContainer) =>
  element.getBoundingClientRect().top -
  (isWindow(container) ? 0 : container.getBoundingClientRect().top);

const getScrollTop = (container: ScrollContainer) =>
  isWindow(container) ? window.scrollY : container.scrollTop;

const hrefToId = (href: string) => {
  const hash = href.includes('#') ? href.split('#').at(-1) : href.replace(/^#/, '');
  if (!hash) return '';
  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
};

const getTarget = (href: string) => {
  const id = hrefToId(href);
  if (!id) return null;
  return document.getElementById(id);
};

const findParentId = (items: FlatTocItem[], activeId: string | undefined) => {
  const index = items.findIndex((item) => item.id === activeId);
  if (index < 0 || items[index].level !== 3) return undefined;
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (items[cursor].level === 2) return items[cursor].id;
  }
  return undefined;
};

const getActiveId = (
  items: FlatTocItem[],
  container: ScrollContainer,
  offset: number,
): string | undefined => {
  let activeId: string | undefined;
  let activeTop = -Infinity;
  for (const item of items) {
    const target = getTarget(item.href);
    if (!target) continue;
    const top = getRelativeTop(target, container);
    if (top <= offset + 1 && top >= activeTop) {
      activeId = item.id;
      activeTop = top;
    }
  }
  return activeId ?? items[0]?.id;
};

const Toc = ({
  activeKey,
  className,
  getContainer,
  items = [],
  offset = DEFAULT_OFFSET,
  onChange,
  onClick,
  style,
  ...rest
}: TocProps) => {
  const flatItems = useMemo(() => toFlatTocItems(items), [items]);
  const listRef = useRef<HTMLOListElement>(null);
  const scrollLockRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [path, setPath] = useState<TocPath>(EMPTY_PATH);
  const [spyActiveId, setSpyActiveId] = useState<string | undefined>(undefined);

  const resolveContainer = useCallback((): ScrollContainer => {
    const container = getContainer?.();
    return container ?? document.body;
  }, [getContainer]);

  const controlledId =
    activeKey != null && activeKey !== ''
      ? hrefToId(String(activeKey)) || flatItems.find((item) => item.key === activeKey)?.id
      : undefined;

  const activeId =
    controlledId ??
    (spyActiveId && flatItems.some((item) => item.id === spyActiveId)
      ? spyActiveId
      : flatItems[0]?.id);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const rows = Array.from(list.children, (child, index) => {
        const row = child as HTMLElement;
        return {
          bottom: row.offsetTop + row.offsetHeight,
          level: flatItems[index]?.level ?? 2,
          top: row.offsetTop,
        };
      });
      setPath(buildTocPath(rows));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [flatItems]);

  useEffect(() => {
    if (flatItems.length === 0) return;
    const container = resolveContainer();
    let frame = 0;
    const spy = () => {
      if (scrollLockRef.current) return;
      const next = getActiveId(flatItems, container, offset);
      setSpyActiveId((prev) => {
        if (prev === next) return prev;
        onChange?.(next ?? null);
        return next;
      });
    };
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(spy);
    };
    spy();
    container.addEventListener('scroll', handleScroll, { passive: true });
    if (container === document.body || container === document.documentElement) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', handleScroll);
      if (container === document.body || container === document.documentElement) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [flatItems, offset, onChange, resolveContainer]);

  useEffect(() => () => clearTimeout(lockTimerRef.current), []);

  const parentId = findParentId(flatItems, activeId);
  const activeIndex = flatItems.findIndex((item) => item.id === activeId);
  const range = path.ranges[activeIndex];

  const handleNavigate = (item: FlatTocItem, event: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(event, { href: item.href, key: item.key, title: item.title });
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = getTarget(item.href);
    if (!target) return;
    event.preventDefault();

    const container = resolveContainer();
    const top = getRelativeTop(target, container) + getScrollTop(container) - offset;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const release = () => {
      scrollLockRef.current = false;
    };
    scrollLockRef.current = true;
    setSpyActiveId(item.id);
    onChange?.(item.id);
    clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(release, SCROLL_LOCK_FALLBACK_MS);
    container.addEventListener('scrollend', release, { once: true });

    const scrollTarget =
      container === document.body || container === document.documentElement ? window : container;
    scrollTarget.scrollTo({
      behavior: reduceMotion ? 'auto' : 'smooth',
      top,
    });
  };

  if (flatItems.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      data-docs-toc=""
      {...rest}
      {...styleProps(styles.root, clsx(tocClasses(), className), style)}
    >
      <div {...styleProps(styles.pathList)}>
        <svg aria-hidden focusable="false" {...styleProps(styles.pathSvg)}>
          <path data-toc-track="" {...styleProps(styles.track, tocClasses('track'))} d={path.d} />
          {range ? (
            <path
              {...styleProps(styles.highlight, tocClasses('highlight'))}
              d={path.d}
              style={{
                strokeDasharray: `${range[1] - range[0]} ${path.length}`,
                strokeDashoffset: -range[0],
              }}
            />
          ) : null}
        </svg>
        <ol ref={listRef} {...styleProps(styles.list, tocClasses('list'))}>
          {flatItems.map((item) => {
            const active = item.id === activeId;
            const parent = item.id === parentId;
            return (
              <li key={item.key}>
                <a
                  aria-current={active ? 'location' : undefined}
                  data-toc-parent={parent ? '' : undefined}
                  href={item.href}
                  {...styleProps(
                    [
                      styles.link,
                      item.level === 3 && styles.linkNested,
                      (active || parent) && styles.linkActive,
                    ],
                    tocClasses('link'),
                  )}
                  onClick={(event) => handleNavigate(item, event)}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

Toc.displayName = 'Toc';

export default Toc;
