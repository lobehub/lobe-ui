'use client';

import { cva } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

interface BubbleProps extends FlexboxProps {
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}

const Bubble = forwardRef<HTMLDivElement, BubbleProps>(
  ({ variant = 'filled', shadow, className, children, ...rest }, ref) => {
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
