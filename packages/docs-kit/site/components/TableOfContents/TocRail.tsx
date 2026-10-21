import * as stylex from '@stylexjs/stylex';
import type { FocusEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useState } from 'react';

import { styles } from './railStyle';
import type { TocViewProps } from './types';

const MAGNIFY = 12;
const MAGNIFY_SPREAD = 2.5;

const tickWidth = (level: 2 | 3, active: boolean, distance: number | undefined) => {
  const base = active ? 20 : level === 3 ? 7 : 12;
  if (distance === undefined) return base;
  return Math.round(base + MAGNIFY * Math.max(0, 1 - distance / MAGNIFY_SPREAD));
};

interface HoverState {
  index: number;
  top: number;
}

export function TocRail({ activeId, items, onNavigate }: TocViewProps) {
  const [hover, setHover] = useState<HoverState | null>(null);

  const showLabel = (event: { currentTarget: HTMLElement }, index: number) => {
    const target = event.currentTarget;
    setHover({ index, top: target.offsetTop + target.offsetHeight / 2 });
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHover(null);
  };

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    onNavigate(id);
  };

  return (
    <nav
      aria-label="On this page"
      data-toc-rail=""
      {...stylex.props(styles.rail)}
      onBlur={handleBlur}
      onMouseLeave={() => setHover(null)}
    >
      <ol {...stylex.props(styles.list)}>
        {items.map((item, index) => {
          const active = item.id === activeId;
          const hovered = hover?.index === index;
          return (
            <li key={item.id}>
              <a
                aria-current={active ? 'location' : undefined}
                aria-label={item.title}
                {...stylex.props(styles.tick)}
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
                onFocus={(event) => showLabel(event, index)}
                onMouseEnter={(event) => showLabel(event, index)}
              >
                <span
                  {...stylex.props(
                    styles.bar,
                    hovered && styles.barHovered,
                    active && styles.barActive,
                    styles.barWidth(
                      tickWidth(
                        item.level,
                        active,
                        hover ? Math.abs(index - hover.index) : undefined,
                      ),
                    ),
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
      {hover ? (
        <span
          aria-hidden
          data-toc-rail-label=""
          {...stylex.props(styles.label, styles.labelTop(hover.top))}
        >
          {items[hover.index]?.title}
        </span>
      ) : null}
    </nav>
  );
}
