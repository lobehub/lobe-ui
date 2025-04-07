'use client';

import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from '../style';

export interface LayoutHeaderProps extends DivProps {
  headerHeight?: number;
}
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
