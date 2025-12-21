'use client';

import { type FC } from 'react';

import { useStyles } from './style';
import type { LoadingDotsProps } from './type';

const LoadingDots: FC<LoadingDotsProps> = ({ size = 8, color, variant = 'dots', className }) => {
  const { styles, cx } = useStyles({ color, size });

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
    <div className={cx(variant === 'orbit' ? styles.orbitWrapper : styles.container, className)}>
      {renderDots()}
    </div>
  );
};

LoadingDots.displayName = 'LoadingDots';

export default LoadingDots;
