'use client';

import { memo } from 'react';

import Button, { type ButtonProps } from '@/Button';

import { useStyles } from './style';

export interface GradientButtonProps extends ButtonProps {
  glow?: boolean;
}

const GradientButton = memo<GradientButtonProps>(
  ({ glow = true, children, className, size = 'large', ...rest }) => {
    const { styles, cx } = useStyles(size);

    return (
      <Button className={cx(styles.button, className)} size={size} variant={'text'} {...rest}>
        {glow && <div className={styles.glow} />}
        {children}
      </Button>
    );
  },
);

GradientButton.displayName = 'GradientButton';

export default GradientButton;
