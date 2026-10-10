'use client';

import { type FC } from 'react';

import { cx } from '@/styles';

import { dividerStyles } from '../style';
import type { FormDividerProps } from '../type';

const FormDivider: FC<FormDividerProps> = ({ visible = true, style, className, ...rest }) => (
  <div
    className={cx(dividerStyles.root, className)}
    role={'separator'}
    style={{ opacity: visible ? 0.66 : 0, ...style }}
    {...rest}
  />
);

FormDivider.displayName = 'FormDivider';

export default FormDivider;
