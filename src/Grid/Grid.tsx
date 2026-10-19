'use client';

import clsx from 'clsx';
import { isString } from 'es-toolkit/compat';
import { type FC } from 'react';
import { useMemo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { gridClasses } from './stable';
import { styles } from './style';
import type { GridProps } from './type';

const Grid: FC<GridProps> = ({
  className,
  gap = '1em',
  rows = 3,
  children,
  maxItemWidth = 240,
  ref,
  style,
  ...rest
}) => {
  // Convert props to CSS variables
  const cssVariables = useMemo<Record<string, string>>(() => {
    const vars: Record<string, string> = {
      '--grid-gap': isString(gap) ? gap : `${gap}px`,
      '--grid-max-item-width': isString(maxItemWidth) ? maxItemWidth : `${maxItemWidth}px`,
      '--grid-rows': `${rows}`,
    };
    return vars;
  }, [gap, maxItemWidth, rows]);

  return (
    <Flexbox
      className={styleProps(styles.root, clsx(gridClasses(), className)).className}
      gap={gap as any}
      ref={ref}
      style={{
        ...cssVariables,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Flexbox>
  );
};

Grid.displayName = 'Grid';

export default Grid;
