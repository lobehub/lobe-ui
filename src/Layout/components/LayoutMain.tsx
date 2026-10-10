'use client';

import { memo } from 'react';

import { cx } from '@/styles';

import { styles } from '../style';
import type { LayoutMainProps } from '../type';

export const LayoutMain = memo<LayoutMainProps>(({ children, className, ...rest }) => {
  return (
    <main className={cx(styles.main, className)} {...rest}>
      {children}
    </main>
  );
});

LayoutMain.displayName = 'LayoutMain';

export default LayoutMain;
