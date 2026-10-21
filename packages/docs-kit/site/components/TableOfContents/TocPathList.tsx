import * as stylex from '@stylexjs/stylex';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { styles } from './style';
import { buildTocPath, type TocPath } from './tocPath';
import type { TocViewProps } from './types';

const EMPTY_PATH: TocPath = { d: '', length: 0, ranges: [] };

export function TocPathList({ activeId, items, onNavigate, parentId }: TocViewProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [path, setPath] = useState<TocPath>(EMPTY_PATH);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const rows = Array.from(list.children, (child, index) => {
        const row = child as HTMLElement;
        return {
          bottom: row.offsetTop + row.offsetHeight,
          level: items[index]?.level ?? 2,
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
  }, [items]);

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const range = path.ranges[activeIndex];

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    onNavigate(id);
  };

  return (
    <div {...stylex.props(styles.pathList)}>
      <svg aria-hidden {...stylex.props(styles.pathSvg)} focusable="false">
        <path {...stylex.props(styles.track)} d={path.d} data-toc-track="" />
        {range ? (
          <path
            {...stylex.props(
              styles.highlight,
              styles.highlightRange(`${range[1] - range[0]} ${path.length}`, -range[0]),
            )}
            d={path.d}
          />
        ) : null}
      </svg>
      <ol {...stylex.props(styles.list)} ref={listRef}>
        {items.map((item) => {
          const active = item.id === activeId;
          const parent = item.id === parentId;
          return (
            <li key={item.id}>
              <a
                aria-current={active ? 'location' : undefined}
                data-toc-parent={parent ? '' : undefined}
                {...stylex.props(
                  styles.link,
                  item.level === 3 && styles.linkNested,
                  (active || parent) && styles.linkActive,
                )}
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
