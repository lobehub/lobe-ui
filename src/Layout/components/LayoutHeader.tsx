'use client';

import { memo } from 'react';

import { useStyles } from '../style';
import type { LayoutHeaderProps } from '../type';

export const LayoutHeader = memo<LayoutHeaderProps>(
  ({ headerHeight, children, className, style, ...rest }) => {
    const { cx, styles } = useStyles(headerHeight);
    return (
      <header
        className={cx(styles.header, className)}
        style={{
          height: headerHeight,
          ...style,
        }}
        {...rest}
      >
        {children}
      </header>
    );
  },
);

LayoutHeader.displayName = 'LayoutHeader';

export default LayoutHeader;
