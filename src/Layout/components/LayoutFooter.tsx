'use client';

import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from '../style';

export type LayoutFooterProps = DivProps;
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
