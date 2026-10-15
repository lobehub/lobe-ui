'use client';

import { memo } from 'react';

import type { LayoutTocProps } from '../type';

export const LayoutToc = memo<LayoutTocProps>(
  ({ tocWidth, style, className, children, ...rest }) => {
    return (
      <nav className={className} style={tocWidth ? { width: tocWidth, ...style } : style} {...rest}>
        {children}
      </nav>
    );
  },
);

LayoutToc.displayName = 'LayoutToc';

export default LayoutToc;
