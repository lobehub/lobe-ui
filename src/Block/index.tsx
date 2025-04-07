'use client';

import { cva } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from '@/Block/style';

export interface BlockProps extends FlexboxProps {
  clickable?: boolean;
  glass?: boolean;
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}

const Block = forwardRef<HTMLDivElement, BlockProps>(
  ({ className, variant = 'filled', shadow, glass, children, clickable, ...rest }, ref) => {
    const { cx, styles } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          compoundVariants: [
            {
              class: styles.clickableBorderless,
              clickable: true,
              variant: 'borderless',
            },
            {
              class: styles.clickableFilled,
              clickable: true,
              variant: 'filled',
            },
            {
              class: styles.clickableOutlined,
              clickable: true,
              variant: 'outlined',
            },
          ],
          defaultVariants: {
            glass: false,
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
            clickable: {
              false: null,
              true: styles.clickableRoot,
            },
            glass: {
              false: null,
              true: styles.glass,
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
      <Flexbox
        className={cx(variants({ clickable, glass, shadow, variant }), className)}
        ref={ref}
        {...rest}
      >
        {children}
      </Flexbox>
    );
  },
);

Block.displayName = 'Block';

export default Block;
