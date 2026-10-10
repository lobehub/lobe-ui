'use client';

import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from '../style';
import type { LayoutHeaderProps } from '../type';

export const LayoutHeader = memo<LayoutHeaderProps>(
  ({ headerHeight, children, className, style, ...rest }) => {
    return (
      <header
        className={styleProps(styles.header, className).className}
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
