'use client';

import { memo } from 'react';

import { useStyles } from '../style';
import type { LayoutMainProps } from '../type';

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
