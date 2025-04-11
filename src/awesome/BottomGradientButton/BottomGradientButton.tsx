'use client';

import { memo } from 'react';

import Button from '@/Button';

import { useStyles } from './style';
import type { BottomGradientButtonProps } from './type';

const BottomGradientButton = memo<BottomGradientButtonProps>(
  ({ className, children, style, ref, ...rest }) => {
    const { cx, styles } = useStyles();

    return (
      <Button
        className={cx(styles, className)}
        ref={ref}
        shape={'round'}
        style={{
          paddingInline: 16,
          width: 'unset',
          ...style,
        }}
        variant={'filled'}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

BottomGradientButton.displayName = 'BottomGradientButton';

export default BottomGradientButton;
