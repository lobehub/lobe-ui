import type { ReactNode } from 'react';
import React from 'react';

import { isReactRenderable } from '../utils/common';

export function getClearIcon(
  prefixCls: string,
  allowClear?: boolean | { clearIcon?: ReactNode },
  clearIcon?: ReactNode,
) {
  const mergedClearIcon = typeof allowClear === 'object' ? allowClear.clearIcon : clearIcon;

  return isReactRenderable(mergedClearIcon) ? (
    mergedClearIcon
  ) : (
    <span className={`${prefixCls}-clear-btn`} />
  );
}
