'use client';

import { cx, useResponsive } from 'antd-style';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { flatGroupStyles, flatGroupVariants } from '../style';
import type { FormFlatGroupProps } from '../type';

const FormFlatGroup = memo<FormFlatGroupProps>(
  ({ className, children, variant = 'borderless', ...rest }) => {
    const { mobile } = useResponsive();
    const styles = flatGroupStyles;

    return (
      <Flexbox
        className={cx(mobile ? styles.mobile : flatGroupVariants({ variant }), className)}
        {...rest}
      >
        {children}
      </Flexbox>
    );
  },
);

FormFlatGroup.displayName = 'FormFlatGroup';

export default FormFlatGroup;
