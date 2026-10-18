'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { useResponsive } from '@/styles/theme/scope';

import { useFormClasses } from '../stableContext';
import { flatGroupStyles } from '../style';
import type { FormFlatGroupProps } from '../type';

const variantStyles = {
  borderless: [stylish.variantBorderlessWithoutHover, flatGroupStyles.borderless],
  filled: [stylish.variantFilledWithoutHover, flatGroupStyles.filled],
  outlined: stylish.variantOutlinedWithoutHover,
};

const FormFlatGroup = memo<FormFlatGroupProps>(
  ({ className, children, variant = 'borderless', style, ...rest }) => {
    const formClasses = useFormClasses();
    const { mobile } = useResponsive();

    return (
      <Flexbox
        {...rest}
        {...styleProps(
          mobile ? flatGroupStyles.mobile : [flatGroupStyles.root, variantStyles[variant]],
          clsx(formClasses('flat-group'), className),
          style,
        )}
      >
        {children}
      </Flexbox>
    );
  },
);

FormFlatGroup.displayName = 'FormFlatGroup';

export default FormFlatGroup;
