'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { layoutClasses } from '../stable';
import type { LayoutTocProps } from '../type';

export const LayoutToc = memo<LayoutTocProps>(
  ({ tocWidth, style, className, children, ...rest }) => {
    return (
      <nav
        className={clsx(layoutClasses('toc'), className)}
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
