'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { layoutClasses } from '../stable';
import { styles } from '../style';
import type { LayoutFooterProps } from '../type';

export const LayoutFooter = memo<LayoutFooterProps>(({ children, className, ...rest }) => {
  return (
    <footer
      className={styleProps(styles.footer, clsx(layoutClasses('footer'), className)).className}
      {...rest}
    >
      {children}
    </footer>
  );
});

LayoutFooter.displayName = 'LayoutFooter';

export default LayoutFooter;
