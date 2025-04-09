'use client';

import { memo } from 'react';

import { useStyles } from '../style';
import type { LayoutFooterProps } from '../type';

export const LayoutFooter = memo<LayoutFooterProps>(({ children, className, ...rest }) => {
  const { cx, styles } = useStyles();
  return (
    <footer className={cx(styles.footer, className)} {...rest}>
      {children}
    </footer>
  );
});

LayoutFooter.displayName = 'LayoutFooter';

export default LayoutFooter;
