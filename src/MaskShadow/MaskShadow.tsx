'use client';

import { cx } from 'antd-style';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';

import { variants } from './style';
import type { MaskShadowProps } from './type';

const MaskShadow = memo<MaskShadowProps>(
  ({ className, children, position = 'bottom', size = 40, ...rest }) => {
    // Convert size prop to CSS variable
    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--mask-shadow-size': `${size}%`,
      }),
      [size],
    );

    return (
      <Flexbox
        className={cx(variants({ position }), className)}
        style={{
          ...cssVariables,
          ...rest.style,
        }}
        {...rest}
      >
        {children}
      </Flexbox>
    );
  },
);

MaskShadow.displayName = 'MaskShadow';

export default MaskShadow;
