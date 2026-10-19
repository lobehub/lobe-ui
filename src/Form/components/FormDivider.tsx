'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { useFormClasses } from '../stableContext';
import { dividerStyles } from '../style';
import type { FormDividerProps } from '../type';

const FormDivider: FC<FormDividerProps> = ({ visible = true, style, className, ...rest }) => {
  const formClasses = useFormClasses();
  return (
    <div
      role={'separator'}
      {...styleProps(
        [dividerStyles.root, !visible && dividerStyles.hidden],
        clsx(formClasses('divider'), className),
        style,
      )}
      {...rest}
    />
  );
};

FormDivider.displayName = 'FormDivider';

export default FormDivider;
