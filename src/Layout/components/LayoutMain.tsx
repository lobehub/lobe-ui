'use client';

import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from '../style';

export type LayoutMainProps = DivProps;

export const LayoutMain = memo<LayoutMainProps>(({ children, className, ...rest }) => {
  const { cx, styles } = useStyles();
  return (
    <main className={cx(styles.main, className)} {...rest}>
      {children}
    </main>
  );
});

LayoutMain.displayName = 'LayoutMain';

export default LayoutMain;
