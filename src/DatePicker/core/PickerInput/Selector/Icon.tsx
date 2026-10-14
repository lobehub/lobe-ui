import { clsx } from 'clsx';
import * as React from 'react';

import { isReactRenderable } from '../../utils/common';
import PickerContext from '../context';

export interface IconProps extends React.HtmlHTMLAttributes<HTMLElement> {
  icon?: React.ReactNode;
}

export default function Icon({ icon, ...restProps }: IconProps) {
  const { prefixCls, classNames, styles } = React.use(PickerContext);

  return isReactRenderable(icon) ? (
    <span
      className={clsx(`${prefixCls}-suffix`, classNames.suffix)}
      style={styles.suffix}
      {...restProps}
    >
      {icon}
    </span>
  ) : null;
}
