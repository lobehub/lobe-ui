'use client';

import { memo } from 'react';

import { cx } from '@/styles';

import { styles } from '../style';
import type { LayoutHeaderProps } from '../type';

export const LayoutHeader = memo<LayoutHeaderProps>(
  ({ headerHeight, children, className, style, ...rest }) => {
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
