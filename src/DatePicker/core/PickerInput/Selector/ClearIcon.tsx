import { clsx } from 'clsx';
import * as React from 'react';

import PickerContext from '../context';

export interface ClearIconProps extends React.HtmlHTMLAttributes<HTMLElement> {
  icon?: React.ReactNode;
  onClear: VoidFunction;
}

export default function ClearIcon({ icon, onClear, ...restProps }: ClearIconProps) {
  const { prefixCls, classNames, styles, locale } = React.use(PickerContext);

  return (
    <button
      {...restProps}
      aria-label={locale.clear}
      className={clsx(`${prefixCls}-clear`, classNames.suffix)}
      style={styles.suffix}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {icon}
    </button>
  );
}
