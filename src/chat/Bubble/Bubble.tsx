'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';

import { styles } from './style';
import type { BubbleProps } from './type';

const variantStyles = {
  borderless: stylish.variantBorderlessWithoutHover,
  filled: styles.filled,
  outlined: stylish.variantOutlinedWithoutHover,
};

const Bubble = memo<BubbleProps>(
  ({ ref, variant = 'filled', shadow, className, children, ...rest }) => {
    return (
      <Flexbox
        ref={ref}
        className={
          styleProps([styles.root, variantStyles[variant], shadow && styles.shadow], className)
            .className
        }
        {...rest}
      >
        {children}
      </Flexbox>
    );
  },
);

Bubble.displayName = 'Bubble';

export default Bubble;
