'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { mobileSafeAreaClasses } from './stable';
import { styles } from './style';
import type { SafeAreaProps } from './type';

const SafeArea: FC<SafeAreaProps> = ({ position, className, style, ...rest }) => {
  return (
    <div
      {...styleProps(
        [styles.container, styles[position]],
        clsx(mobileSafeAreaClasses(), className),
        style,
      )}
      {...toDataAttributes({ position })}
      {...rest}
    />
  );
};

SafeArea.displayName = 'SafeArea';

export default SafeArea;
