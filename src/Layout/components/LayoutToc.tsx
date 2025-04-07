'use client';

import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from '../style';

export interface LayoutTocProps extends DivProps {
  tocWidth?: number;
}
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
