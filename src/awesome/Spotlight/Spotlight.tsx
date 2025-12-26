'use client';

import { cx, useThemeMode } from 'antd-style';
import { memo, useMemo } from 'react';

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

  const spotlightStyle = isDarkMode
    ? outside
      ? styles.spotlightDarkOutside
      : styles.spotlightDark
    : outside
      ? styles.spotlightLightOutside
      : styles.spotlightLight;

  return (
    <div
      className={cx(spotlightStyle, className)}
      ref={reference}
      style={cssVariables}
      {...properties}
    />
  );
});

Spotlight.displayName = 'Spotlight';

export default Spotlight;
