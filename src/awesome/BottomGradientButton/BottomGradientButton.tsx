'use client';

import { memo } from 'react';

import { ButtonImpl } from '@/Button/Button';

import { styles } from './style';
import type { BottomGradientButtonProps } from './type';

const BottomGradientButton = memo<BottomGradientButtonProps>(
  ({ className, children, style, ref, ...rest }) => {
    return (
      <ButtonImpl
        className={className}
        ref={ref}
        shape={'round'}
        type={'fill'}
        xstyle={styles.root}
        style={{
          paddingInline: 16,
          width: 'unset',
          ...style,
        }}
        {...rest}
      >
        {children}
      </ButtonImpl>
    );
  },
);

BottomGradientButton.displayName = 'BottomGradientButton';

export default BottomGradientButton;
