'use client';

import { memo } from 'react';

import Button from '@/base-ui/Button';
import { cx } from '@/styles';

import { styles } from './style';
import type { BottomGradientButtonProps } from './type';

const BottomGradientButton = memo<BottomGradientButtonProps>(
  ({ className, children, style, ref, ...rest }) => {
    return (
      <Button
        className={cx(styles, className)}
        ref={ref}
        shape={'round'}
        type={'fill'}
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
