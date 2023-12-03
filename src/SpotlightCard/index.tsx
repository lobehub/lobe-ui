import { isNumber } from 'lodash-es';
import { ReactNode, memo, useEffect, useMemo, useRef } from 'react';

import { DivProps } from '@/types';

import SpotlightCardItem from './SpotlightCardItem';
import { CHILDREN_CLASSNAME, useStyles } from './style';

export interface SpotlightCardProps<T = any> extends DivProps {
  borderRadius?: number;
  columns?: string | number;
  gap?: number;
  items: T[];
  renderItem: (item: T) => ReactNode;
  size?: number;
  spotlight?: boolean;
}

const SpotlightCard = memo<SpotlightCardProps>(
  ({
    items,
    renderItem: Content,
    className,
    columns = 3,
    gap = 12,
    style,
    size = 800,
    borderRadius = 12,
    spotlight = true,
    ...rest
  }) => {
    const { styles, cx } = useStyles({ borderRadius, size });
    const ref = useRef<HTMLDivElement>(null);

    const gridColumns = useMemo(
      () => (isNumber(columns) ? Array.from({ length: columns }).fill('1fr').join(' ') : columns),
      [columns],
    );

    useEffect(() => {
      if (!ref.current) return;
      if (!spotlight) return;
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
        style={{ gap, gridTemplateColumns: gridColumns, ...style }}
        {...rest}
      >
        {items.map((item, index) => {
          return (
            <SpotlightCardItem
              borderRadius={borderRadius}
              className={CHILDREN_CLASSNAME}
              key={index}
              size={size}
            >
              <Content {...item} />
            </SpotlightCardItem>
          );
        })}
      </div>
    );
  },
);

export default SpotlightCard;
