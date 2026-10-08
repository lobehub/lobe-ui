'use client';

import * as stylex from '@stylexjs/stylex';
import {
  type CSSProperties,
  memo,
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useMergeRefs } from 'react-merge-refs';
import useControlledState from 'use-merge-value';

import { useEventCallback } from '@/hooks/useEventCallback';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { AnchorItem, AnchorProps } from './type';

type ScrollContainer = HTMLElement | Window;

const SCROLL_LOCK_FALLBACK_MS = 1000;

const flatten = (items: AnchorItem[]): AnchorItem[] =>
  items.flatMap((item) => [item, ...flatten(item.children ?? [])]);

const getTarget = (href: string) => {
  const hash = href.split('#')[1];
  if (!hash) return null;
  try {
    return document.getElementById(decodeURIComponent(hash));
  } catch {
    return document.getElementById(hash);
  }
};

const isWindow = (container: ScrollContainer): container is Window => container === window;

const getRelativeTop = (element: HTMLElement, container: ScrollContainer) =>
  element.getBoundingClientRect().top -
  (isWindow(container) ? 0 : container.getBoundingClientRect().top);

const getScrollTop = (container: ScrollContainer) =>
  isWindow(container) ? window.scrollY : container.scrollTop;

const getActiveKey = (
  items: AnchorItem[],
  container: ScrollContainer,
  offset: number,
): string | null => {
  let activeKey: string | null = null;
  let activeTop = -Infinity;
  for (const item of flatten(items)) {
    const target = getTarget(item.href);
    if (!target) continue;
    const top = getRelativeTop(target, container);
    if (top <= offset + 1 && top >= activeTop) {
      activeKey = item.key;
      activeTop = top;
    }
  }
  return activeKey;
};

const Anchor = memo<AnchorProps>(
  ({
    activeKey,
    className,
    getContainer,
    items,
    offset = 0,
    onChange,
    onClick,
    ref,
    style,
    ...rest
  }) => {
    const [mergedActiveKey, setMergedActiveKey] = useControlledState<string | null>(null, {
      onChange,
      value: activeKey,
    });
    const scrollLockRef = useRef(false);
    const navRef = useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs([ref, navRef]);
    const [marker, setMarker] = useState<CSSProperties>();
    const lockTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const resolveContainer = useEventCallback((): ScrollContainer => getContainer?.() ?? window);
    const setActive = useEventCallback(setMergedActiveKey);
    const spy = useEventCallback(() => {
      if (scrollLockRef.current) return;
      setActive(getActiveKey(items, resolveContainer(), offset));
    });

    useEffect(() => {
      const container = resolveContainer();
      let frame = 0;
      const handleScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(spy);
      };
      spy();
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        cancelAnimationFrame(frame);
        container.removeEventListener('scroll', handleScroll);
      };
    }, [items, offset, resolveContainer, spy]);

    useEffect(() => () => clearTimeout(lockTimerRef.current), []);

    useLayoutEffect(() => {
      const nav = navRef.current;
      if (!nav) return;
      const place = () => {
        const link = [...nav.querySelectorAll<HTMLElement>('a[data-key]')].find(
          (element) => element.dataset.key === mergedActiveKey,
        );
        setMarker(
          link ? { height: link.offsetHeight, insetBlockStart: link.offsetTop } : undefined,
        );
      };
      place();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(place);
      observer.observe(nav);
      return () => observer.disconnect();
    }, [items, mergedActiveKey]);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>, item: AnchorItem) => {
      onClick?.(event, item);
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = getTarget(item.href);
      if (!target) return;
      event.preventDefault();

      const container = resolveContainer();
      const top = getRelativeTop(target, container) + getScrollTop(container) - offset;
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      // Smooth scrolling may never bring a heading near the page end up to the offset line, so the
      // clicked item is pinned as active until the scroll settles.
      const release = () => {
        scrollLockRef.current = false;
      };
      scrollLockRef.current = true;
      setActive(item.key);
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = setTimeout(release, SCROLL_LOCK_FALLBACK_MS);
      container.addEventListener('scrollend', release, { once: true });
      container.scrollTo({ behavior: reduceMotion ? 'auto' : 'smooth', top });
    };

    const renderList = (list: AnchorItem[], nested: boolean) => (
      <ul {...stylex.props(styles.list, nested && styles.listNested)}>
        {list.map((item) => (
          <li key={item.key}>
            <a
              aria-current={item.key === mergedActiveKey ? 'location' : undefined}
              {...stylex.props(styles.link, nested && styles.linkNested)}
              data-key={item.key}
              href={item.href}
              title={typeof item.title === 'string' ? item.title : undefined}
              onClick={(event) => handleClick(event, item)}
            >
              {item.title}
            </a>
            {item.children && item.children.length > 0 && renderList(item.children, true)}
          </li>
        ))}
      </ul>
    );

    return (
      <nav ref={mergedRef} {...rest} {...styleProps(styles.root, className, style)}>
        <span aria-hidden {...stylex.props(styles.marker)} hidden={!marker} style={marker} />
        {renderList(items, false)}
      </nav>
    );
  },
);

Anchor.displayName = 'Anchor';

export default Anchor;
