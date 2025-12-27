'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

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
