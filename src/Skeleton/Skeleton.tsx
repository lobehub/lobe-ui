'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { skeletonClasses } from './stable';
import { styles } from './style';
import type { SkeletonProps } from './type';

export const SkeletonImpl: FC<SkeletonProps & { xstyle?: Parameters<typeof styleProps>[0] }> = ({
  animated = true,
  width,
  height,
  radius,
  className,
  style,
  xstyle,
  ...rest
}) => (
  <div
    style={{ borderRadius: radius, height, width, ...style }}
    className={
      styleProps(
        [styles.base, animated && styles[animated === true ? 'fade' : animated], xstyle],
        clsx(skeletonClasses(), className),
      ).className
    }
    {...toDataAttributes({ animated: animated === true ? 'fade' : animated })}
    {...rest}
  />
);

SkeletonImpl.displayName = 'Skeleton';

const Skeleton = SkeletonImpl as FC<SkeletonProps>;

export default Skeleton;
