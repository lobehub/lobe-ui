'use client';

import { createStyles } from 'antd-style';
import { FC, PropsWithChildren } from 'react';

import Grid from '@/Grid';

import Card from './Card';

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

interface _CardsProps extends PropsWithChildren {
  maxItemWidth?: string | number;
  rows?: number;
}

const _Cards: FC<_CardsProps> = ({ children, maxItemWidth = 250, rows = 3 }) => {
  const { styles } = useStyles();
  return (
    <Grid className={styles.container} maxItemWidth={maxItemWidth} rows={rows}>
      {children}
    </Grid>
  );
};

export type CardsProps = typeof _Cards & {
  Card: typeof Card;
};

const Cards = _Cards as CardsProps;
Cards.Card = Card;

export default Cards;
