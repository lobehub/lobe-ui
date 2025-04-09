'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';
import type { BlockProps } from './type';

const Block = memo<BlockProps>(
  ({ className, variant = 'filled', shadow, glass, children, clickable, ref, ...rest }) => {
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
            clickable: false,
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
