'use client';

import { memo } from 'react';

import Button from '@/Button';

import { useStyles } from './style';
import type { GradientButtonProps } from './type';

const GradientButton = memo<GradientButtonProps>(
  ({ glow = true, children, className, size, disabled, ...rest }) => {
    const { styles, cx } = useStyles(size);

    return (
      <Button
        className={cx(!disabled && styles.button, className)}
        disabled={disabled}
        size={size}
        variant={disabled ? undefined : 'text'}
        {...rest}
      >
        {glow && <div className={styles.glow} />}
        {children}
      </Button>
    );
  },
);

GradientButton.displayName = 'GradientButton';

export default GradientButton;
