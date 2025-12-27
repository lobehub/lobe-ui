'use client';

import { cx } from 'antd-style';
import type { FC } from 'react';

import Grid, { type GridProps } from '@/Grid';

import { styles } from './style';

export type CardsProps = GridProps;

const Cards: FC<CardsProps> = ({ children, className, maxItemWidth = 250, rows = 3, ...rest }) => {
  return (
    <Grid
      className={cx(styles.container, className)}
      maxItemWidth={maxItemWidth}
      rows={rows}
      {...rest}
    >
      {children}
    </Grid>
  );
};

Cards.displayName = 'MdxCards';

export default Cards;
