'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import { styles } from '../style';
import type { LayoutFooterProps } from '../type';

export const LayoutFooter = memo<LayoutFooterProps>(({ children, className, ...rest }) => {
  return (
    <footer className={cx(styles.footer, className)} {...rest}>
      {children}
    </footer>
  );
});

LayoutFooter.displayName = 'LayoutFooter';

export default LayoutFooter;
