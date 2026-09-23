'use client';

import { useEffect, useState } from 'react';

import { styles } from './style';
import type { RouteProgressProps } from './type';

const FADE_MS = 200;
const CREEP_MS = 120;

function RouteProgress({ loading = false }: RouteProgressProps) {
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (loading) {
      const creep = window.setInterval(() => {
        setProgress((value) => {
          const from = value ?? 0;
          return from >= 0.9 ? from : from + (0.9 - from) * 0.2;
        });
      }, CREEP_MS);
      return () => window.clearInterval(creep);
    }

    const settle = window.setTimeout(() => {
      setProgress((value) => (value === null ? null : 1));
    }, 0);
    const hide = window.setTimeout(() => setProgress(null), FADE_MS);
    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(hide);
    };
  }, [loading]);

  if (progress === null) return null;
  return (
    <div
      aria-hidden
      className={styles.bar}
      style={{
        opacity: progress >= 1 ? 0 : 1,
        transform: `scaleX(${progress})`,
        transition: `transform ${FADE_MS}ms ease-out, opacity ${FADE_MS}ms ease-in`,
      }}
    />
  );
}

RouteProgress.displayName = 'RouteProgress';

export default RouteProgress;
