'use client';

import { memo } from 'react';

import { cx } from '@/styles';

import { styles } from '../style';
import type { LayoutTocProps } from '../type';

export const LayoutToc = memo<LayoutTocProps>(
  ({ tocWidth, style, className, children, ...rest }) => {
    return (
      <nav
        className={cx(styles.toc, className)}
        style={tocWidth ? { width: tocWidth, ...style } : style}
        {...rest}
      >
        {children}
      </nav>
    );
  },
);

LayoutToc.displayName = 'LayoutToc';

export default LayoutToc;
