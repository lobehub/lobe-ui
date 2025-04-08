'use client';

import { forwardRef } from 'react';

import Button, { type ButtonProps } from '@/Button';

import { useStyles } from './style';

export type BottomGradientButtonProps = ButtonProps;

const BottomGradientButton = forwardRef<HTMLButtonElement, BottomGradientButtonProps>(
  ({ className, children, style, ...rest }, ref) => {
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
