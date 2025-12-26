'use client';

import { Segmented as AntdSegmented } from 'antd';
import { cx } from 'antd-style';
import { memo } from 'react';

import { variants } from './style';
import type { SegmentedProps } from './type';

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
