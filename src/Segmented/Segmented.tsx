import { Segmented as AntdSegmented } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { useStyles } from './style';
import type { SegmentedProps } from './type';

const Segmented = memo<SegmentedProps>(
  ({ ref, padding, style, className, variant = 'filled', shadow, glass, ...rest }) => {
    const { cx, styles } = useStyles();
    const variants = useMemo(
      () =>
        cva(styles.root, {
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
      <AntdSegmented
        className={cx(variants({ glass, shadow, variant }), className)}
        ref={ref}
        style={{
          padding,
          ...style,
        }}
        {...rest}
      />
    );
  },
);

Segmented.displayName = 'Segmented';

export default Segmented;
