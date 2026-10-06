'use client';

import { memo } from 'react';

import { cx } from '@/styles';

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
