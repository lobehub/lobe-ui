'use client';

import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from '../style';
import type { LayoutFooterProps } from '../type';

export const LayoutFooter = memo<LayoutFooterProps>(({ children, className, ...rest }) => {
  return (
    <footer className={styleProps(styles.footer, className).className} {...rest}>
      {children}
    </footer>
  );
});

LayoutFooter.displayName = 'LayoutFooter';

export default LayoutFooter;
