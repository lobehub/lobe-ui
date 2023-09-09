import { ReactNode, memo, useEffect, useRef } from 'react';

import { DivProps } from '@/types';

import SpotlightCardItem from './SpotlightCardItem';
import { CHILDREN_CLASSNAME, useStyles } from './style';

export interface SpotlightCardProps<T = any> extends DivProps {
  borderRadius?: number;
  columns?: string;
  gap?: number;
  items: T[];
  renderItem: (item: T) => ReactNode;
  size?: number;
}

const SpotlightCard = memo<SpotlightCardProps>(
  ({
    items,
    renderItem,
    className,
    columns = '1fr 1fr 1fr',
    gap = 12,
    style,
    size = 800,
    borderRadius = 12,
    ...props
  }) => {
    const { styles, cx } = useStyles({ borderRadius, size });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
      const fn = (e: MouseEvent) => {
        for (const card of document.querySelectorAll(`.${CHILDREN_CLASSNAME}`)) {
          const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

          (card as HTMLDivElement).style.setProperty('--mouse-x', `${x}px`);
          (card as HTMLDivElement).style.setProperty('--mouse-y', `${y}px`);
        }
      };
      ref.current.addEventListener('mousemove', fn);

      return () => {
        ref.current?.removeEventListener('mousemove', fn);
      };
    }, []);

    return (
      <div
        className={cx(styles.container, styles.grid, className)}
        ref={ref}
        style={{ gap, gridTemplateColumns: columns, ...style }}
        {...props}
      >
        {items.map((item, index) => {
          const children = renderItem(item);
          return (
            <SpotlightCardItem
              borderRadius={borderRadius}
              className={CHILDREN_CLASSNAME}
              key={index}
              size={size}
            >
              {children}
            </SpotlightCardItem>
          );
        })}
      </div>
    );
  },
);

export default SpotlightCard;
