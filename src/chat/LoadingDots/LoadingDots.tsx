'use client';

import * as stylex from '@stylexjs/stylex';
import { type FC, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
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

  const renderDots = () => {
    switch (variant) {
      case 'pulse': {
        return (
          <div {...stylex.props(styles.dot, styles.pulseDot)} style={{ animationDelay: '0s' }} />
        );
      }

      case 'wave': {
        return (
          <>
            <div {...stylex.props(styles.dot, styles.waveDot)} style={{ animationDelay: '0s' }} />
            <div
              {...stylex.props(styles.dot, styles.waveDot)}
              style={{ animationDelay: '0.12s' }}
            />
            <div
              {...stylex.props(styles.dot, styles.waveDot)}
              style={{ animationDelay: '0.24s' }}
            />
          </>
        );
      }

      case 'orbit': {
        return (
          <div {...stylex.props(styles.orbitContainer)}>
            <div {...stylex.props(styles.orbitDot)} style={{ animationDelay: '0s' }} />
            <div {...stylex.props(styles.orbitDot)} style={{ animationDelay: '-0.4s' }} />
            <div {...stylex.props(styles.orbitDot)} style={{ animationDelay: '-0.8s' }} />
          </div>
        );
      }

      case 'typing': {
        return (
          <>
            <div {...stylex.props(styles.dot, styles.typingDot)} style={{ animationDelay: '0s' }} />
            <div
              {...stylex.props(styles.dot, styles.typingDot)}
              style={{ animationDelay: '0.15s' }}
            />
            <div
              {...stylex.props(styles.dot, styles.typingDot)}
              style={{ animationDelay: '0.3s' }}
            />
          </>
        );
      }

      default: {
        return (
          <>
            <div
              {...stylex.props(styles.dot, styles.defaultDot)}
              style={{ animationDelay: '0s' }}
            />
            <div
              {...stylex.props(styles.dot, styles.defaultDot)}
              style={{ animationDelay: '0.15s' }}
            />
            <div
              {...stylex.props(styles.dot, styles.defaultDot)}
              style={{ animationDelay: '0.3s' }}
            />
          </>
        );
      }
    }
  };

  return (
    <div
      {...styleProps(variant === 'orbit' ? styles.orbitWrapper : styles.container, className, {
        ...cssVariables,
        ...style,
      })}
    >
      {renderDots()}
    </div>
  );
};

LoadingDots.displayName = 'LoadingDots';

export default LoadingDots;
