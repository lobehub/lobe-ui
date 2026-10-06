'use client';

import { Segmented as AntdSegmented } from 'antd';
import { memo } from 'react';

import { cx } from '@/styles';

import { variants } from './style';
import type { SegmentedProps } from './type';

/**
 * @deprecated Use `Segmented` from `@lobehub/ui/base-ui` instead.
 */
const Segmented = memo<SegmentedProps>(
  ({ ref, padding, style, className, variant = 'filled', shadow, glass, ...rest }) => {
    return (
      <AntdSegmented
        className={cx(variants({ glass, shadow, variant }), className)}
        ref={ref}
        style={{
          padding,
          ...style,
        }}
        {...rest}
      />
    );
  },
);

Segmented.displayName = 'Segmented';

export default Segmented;
