'use client';

import { cx } from 'antd-style';
import { type FC, useMemo } from 'react';

import { styles } from './style';
import type { LoadingDotsProps } from './type';

const LoadingDots: FC<LoadingDotsProps> = ({
  size = 8,
  color,
  variant = 'dots',
  className,
  style,
}) => {
  // Convert props to CSS variables
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
        return <div className={styles.pulseDot} style={{ animationDelay: '0s' }} />;
      }

      case 'wave': {
        return (
          <>
            <div className={styles.waveDot} style={{ animationDelay: '0s' }} />
            <div className={styles.waveDot} style={{ animationDelay: '0.12s' }} />
            <div className={styles.waveDot} style={{ animationDelay: '0.24s' }} />
          </>
        );
      }

      case 'orbit': {
        return (
          <div className={styles.orbitContainer}>
            <div className={styles.orbitDot} style={{ animationDelay: '0s' }} />
            <div className={styles.orbitDot} style={{ animationDelay: '-0.4s' }} />
            <div className={styles.orbitDot} style={{ animationDelay: '-0.8s' }} />
          </div>
        );
      }

      case 'typing': {
        return (
          <>
            <div className={styles.typingDot} style={{ animationDelay: '0s' }} />
            <div className={styles.typingDot} style={{ animationDelay: '0.15s' }} />
            <div className={styles.typingDot} style={{ animationDelay: '0.3s' }} />
          </>
        );
      }

      default: {
        return (
          <>
            <div className={styles.defaultDot} style={{ animationDelay: '0s' }} />
            <div className={styles.defaultDot} style={{ animationDelay: '0.15s' }} />
            <div className={styles.defaultDot} style={{ animationDelay: '0.3s' }} />
          </>
        );
      }
    }
  };

  return (
    <div
      className={cx(variant === 'orbit' ? styles.orbitWrapper : styles.container, className)}
      style={{
        ...cssVariables,
        ...style,
      }}
    >
      {renderDots()}
    </div>
  );
};

LoadingDots.displayName = 'LoadingDots';

export default LoadingDots;
