'use client';

import { memo } from 'react';

import { useStyles } from '../style';
import type { LayoutTocProps } from '../type';

export const LayoutToc = memo<LayoutTocProps>(
  ({ tocWidth, style, className, children, ...rest }) => {
    const { cx, styles } = useStyles();
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
