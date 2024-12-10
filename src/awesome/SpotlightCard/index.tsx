'use client';

import { ReactNode, memo, useEffect, useRef } from 'react';

import Grid from '@/Grid';
import { DivProps } from '@/types';

import SpotlightCardItem from './SpotlightCardItem';
import { CHILDREN_CLASSNAME, useStyles } from './style';

export interface SpotlightCardProps<T = any> extends DivProps {
  borderRadius?: number;
  columns?: number;
  gap?: number | string;
  items: T[];
  maxItemWidth?: string | number;
  renderItem: (item: T) => ReactNode;
  size?: number;
  spotlight?: boolean;
}

const SpotlightCard = memo<SpotlightCardProps>(
  ({
    items,
    renderItem: Content,
    maxItemWidth,
    className,
    columns = 3,
    gap = '1em',
    style,
    size = 800,
    borderRadius = 12,
    spotlight = true,
    ...rest
  }) => {
    const { styles, cx } = useStyles({ borderRadius, size });
    const ref = useRef<HTMLDivElement>(null);

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
      <Grid
        className={cx(styles.container, styles.grid, className)}
        gap={gap}
        maxItemWidth={maxItemWidth}
        ref={ref}
        rows={columns}
        style={style}
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
      </Grid>
    );
  },
);

export default SpotlightCard;
