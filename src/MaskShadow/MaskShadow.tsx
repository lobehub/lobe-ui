'use client';

import clsx from 'clsx';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { maskShadowClasses } from './stable';
import { styles } from './style';
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
        {...toDataAttributes({ position })}
        className={
          styleProps([styles.root, styles[position]], clsx(maskShadowClasses(), className))
            .className
        }
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
