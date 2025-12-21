'use client';

import { useResponsive } from 'antd-style';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';

import { useFlatGroupStyles as useStyles } from '../style';
import type { FormFlatGroupProps } from '../type';

const FormFlatGroup = memo<FormFlatGroupProps>(
  ({ className, children, variant = 'borderless', ...rest }) => {
    const { mobile } = useResponsive();
    const { cx, styles } = useStyles(variant);

    const vriants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Flexbox className={cx(mobile ? styles.mobile : vriants({ variant }), className)} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

FormFlatGroup.displayName = 'FormFlatGroup';

export default FormFlatGroup;
