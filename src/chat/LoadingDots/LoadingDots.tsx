'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import clsx from 'clsx';
import { type FC, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { chatLoadingDotsClasses } from './stable';
import { delays, styles } from './style';
import type { LoadingDotsProps } from './type';

const LoadingDots: FC<LoadingDotsProps> = ({
  size = 8,
  color,
  variant = 'dots',
  className,
  style,
}) => {
  const cssVariables = useMemo<Record<string, string>>(() => {
    const vars: Record<string, string> = {
      '--loading-dots-size': `${size}px`,
    };
    if (color) {
      vars['--loading-dots-color'] = color;
    }
    return vars;
  }, [color, size]);

  const dot = (variantStyle: StyleXStyles, delay: keyof typeof delays) => (
    <div
      {...styleProps([styles.dot, variantStyle, delays[delay]], chatLoadingDotsClasses('dot'))}
    />
  );

  const renderDots = () => {
    switch (variant) {
      case 'pulse': {
        return dot(styles.pulseDot, 'd0');
      }
      case 'wave': {
        return (
          <>
            {dot(styles.waveDot, 'd0')}
            {dot(styles.waveDot, 'd12')}
            {dot(styles.waveDot, 'd24')}
          </>
        );
      }
      case 'orbit': {
        return (
          <div {...styleProps(styles.orbitContainer, chatLoadingDotsClasses('orbit'))}>
            {(['d0', 'dMinus40', 'dMinus80'] as const).map((delay) => (
              <div
                key={delay}
                {...styleProps([styles.orbitDot, delays[delay]], chatLoadingDotsClasses('dot'))}
              />
            ))}
          </div>
        );
      }
      case 'typing': {
        return (
          <>
            {dot(styles.typingDot, 'd0')}
            {dot(styles.typingDot, 'd15')}
            {dot(styles.typingDot, 'd30')}
          </>
        );
      }
      default: {
        return (
          <>
            {dot(styles.defaultDot, 'd0')}
            {dot(styles.defaultDot, 'd15')}
            {dot(styles.defaultDot, 'd30')}
          </>
        );
      }
    }
  };

  return (
    <div
      {...styleProps(
        variant === 'orbit' ? styles.orbitWrapper : styles.container,
        clsx(chatLoadingDotsClasses(), className),
        { ...cssVariables, ...style },
      )}
      {...toDataAttributes({ variant })}
    >
      {renderDots()}
    </div>
  );
};

LoadingDots.displayName = 'LoadingDots';

export default LoadingDots;
