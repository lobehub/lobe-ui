'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { ButtonImpl } from '@/Button/Button';

import { awesomeBottomGradientButtonClasses } from './stable';
import { styles } from './style';
import type { BottomGradientButtonProps } from './type';

const BottomGradientButton = memo<BottomGradientButtonProps>(
  ({ className, children, style, ref, ...rest }) => {
    return (
      <ButtonImpl
        className={clsx(awesomeBottomGradientButtonClasses(), className)}
        ref={ref}
        shape={'round'}
        style={style}
        type={'fill'}
        xstyle={styles.root}
        {...rest}
      >
        {children}
      </ButtonImpl>
    );
  },
);

BottomGradientButton.displayName = 'BottomGradientButton';

export default BottomGradientButton;
