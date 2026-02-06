'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import Button from '@/Button';

import { styles } from './style';
import type { BottomGradientButtonProps } from './type';

const BottomGradientButton = memo<BottomGradientButtonProps>(
  ({ className, children, style, ref, ...rest }) => {
    return (
      <Button
        className={cx(styles, className)}
        ref={ref}
        shape={'round'}
        variant={'filled'}
        style={{
          paddingInline: 16,
          width: 'unset',
          ...style,
        }}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

BottomGradientButton.displayName = 'BottomGradientButton';

export default BottomGradientButton;
