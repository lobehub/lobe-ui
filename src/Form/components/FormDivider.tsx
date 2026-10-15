'use client';

import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { dividerStyles } from '../style';
import type { FormDividerProps } from '../type';

const FormDivider: FC<FormDividerProps> = ({ visible = true, style, className, ...rest }) => (
  <div
    role={'separator'}
    {...styleProps(dividerStyles.root, className, { opacity: visible ? 0.66 : 0, ...style })}
    {...rest}
  />
);

FormDivider.displayName = 'FormDivider';

export default FormDivider;
