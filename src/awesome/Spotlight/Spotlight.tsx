'use client';

import { memo, useMemo } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import { styles } from './style';
import type { SpotlightProps } from './type';
import { useMouseOffset } from './useMouseOffset';

const Spotlight = memo<SpotlightProps>(({ className, size = 64, ...properties }) => {
  const [offset, outside, reference] = useMouseOffset();
  const { isDarkMode } = useThemeMode();

  const cssVariables = useMemo<Record<string, string>>(
    () => ({
      '--spotlight-opacity': outside ? '0' : '0.1',
      '--spotlight-size': `${size}px`,
      '--spotlight-x': `${offset?.x ?? 0}px`,
      '--spotlight-y': `${offset?.y ?? 0}px`,
    }),
    [offset, size, outside],
  );

  return (
    <div
      {...styleProps(
        [styles.root, isDarkMode ? styles.dark : styles.light, outside && styles.outside],
        className,
      )}
      ref={reference}
      style={cssVariables}
      {...properties}
    />
  );
});

Spotlight.displayName = 'Spotlight';

export default Spotlight;
