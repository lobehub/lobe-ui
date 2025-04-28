'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';
import type { MaskShadowProps } from './type';

const MaskShadow = memo<MaskShadowProps>(
  ({ className, children, position = 'bottom', size = 40, ...rest }) => {
    const { cx, styles } = useStyles(size);

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            position: 'bottom',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            position: {
              top: styles.topShadow,
              bottom: styles.bottomShadow,
              left: styles.leftShadow,
              right: styles.rightShadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Flexbox className={cx(variants({ position }), className)} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

MaskShadow.displayName = 'MaskShadow';

export default MaskShadow;
