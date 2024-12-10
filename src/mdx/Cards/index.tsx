'use client';

import { createStyles } from 'antd-style';
import { FC } from 'react';

import Grid, { type GridProps } from '@/Grid';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);

      > div {
        margin: 0 !important;
      }
    `,
  };
});

export type CardsProps = GridProps;

const Cards: FC<CardsProps> = ({ children, className, maxItemWidth = 250, rows = 3, ...rest }) => {
  const { cx, styles } = useStyles();
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

export default Cards;
