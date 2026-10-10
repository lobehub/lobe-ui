'use client';

import './style.css';

import clsx from 'clsx';
import type { FC } from 'react';

import Grid, { type GridProps } from '@/Grid';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';

export type CardsProps = GridProps;

const Cards: FC<CardsProps> = ({ children, className, maxItemWidth = 250, rows = 3, ...rest }) => {
  return (
    <Grid
      {...styleProps(styles.container, clsx('lobe-mdx-cards', className))}
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
