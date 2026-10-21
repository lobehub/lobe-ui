import { Popover } from '@lobehub/ui';
import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { styles } from './barStyle';
import { TocPathList } from './TocPathList';
import type { TocViewProps } from './types';

const RING_RADIUS = 6;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function TocBar(props: TocViewProps) {
  const { activeId, items, onNavigate } = props;
  const [open, setOpen] = useState(false);

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const progress = items.length > 0 ? (Math.max(activeIndex, 0) + 1) / items.length : 0;
  const activeTitle = items[activeIndex]?.title ?? 'On this page';

  const handleNavigate = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <div data-toc-bar="" {...stylex.props(styles.bar)}>
      <Popover
        open={open}
        placement="bottomLeft"
        popupProps={{ 'aria-label': 'On this page' }}
        trigger="click"
        content={
          <nav aria-label="On this page" data-toc-popup="" {...stylex.props(styles.popup)}>
            <TocPathList {...props} onNavigate={handleNavigate} />
          </nav>
        }
        onOpenChange={setOpen}
      >
        <button
          aria-label={`On this page: ${activeTitle}`}
          {...stylex.props(styles.trigger)}
          type="button"
        >
          <svg aria-hidden {...stylex.props(styles.ring)} focusable="false" viewBox="0 0 16 16">
            <circle {...stylex.props(styles.ringTrack)} cx="8" cy="8" r={RING_RADIUS} />
            <circle
              {...stylex.props(
                styles.ringValue,
                styles.ringOffset(RING_CIRCUMFERENCE, RING_CIRCUMFERENCE * (1 - progress)),
              )}
              cx="8"
              cy="8"
              r={RING_RADIUS}
            />
          </svg>
          <span {...stylex.props(styles.title)}>{activeTitle}</span>
          <ChevronDown
            aria-hidden
            {...stylex.props(styles.chevron, open && styles.chevronOpen)}
            size={14}
            strokeWidth={1.8}
          />
        </button>
      </Popover>
    </div>
  );
}
