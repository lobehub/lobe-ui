'use client';

import { createStyles } from 'antd-style';
import { FC, PropsWithChildren } from 'react';

import Grid from '@/Grid';

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

export interface CardsProps extends PropsWithChildren {
  maxItemWidth?: string | number;
  rows?: number;
}

const Cards: FC<CardsProps> = ({ children, maxItemWidth = 250, rows = 3 }) => {
  const { styles } = useStyles();
  return (
    <Grid className={styles.container} maxItemWidth={maxItemWidth} rows={rows}>
      {children}
    </Grid>
  );
};

export default Cards;
