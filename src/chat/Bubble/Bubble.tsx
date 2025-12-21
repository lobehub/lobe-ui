'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';

import { useStyles } from './style';
import type { BubbleProps } from './type';

const Bubble = memo<BubbleProps>(
  ({ ref, variant = 'filled', shadow, className, children, ...rest }) => {
    const { cx, styles } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Flexbox className={cx(variants({ shadow, variant }), className)} ref={ref} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

Bubble.displayName = 'Bubble';

export default Bubble;
