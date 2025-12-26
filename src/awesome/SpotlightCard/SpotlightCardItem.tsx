'use client';

import { cx, useThemeMode } from 'antd-style';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';

import { styles } from './style';
import type { SpotlightCardItemProps } from './type';

const SpotlightCardItem = memo<SpotlightCardItemProps>(
  ({ children, className, style, borderRadius, size, ...rest }) => {
    const { isDarkMode } = useThemeMode();

    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--spotlight-card-border-radius': `${borderRadius}px`,
        '--spotlight-card-size': `${size}px`,
      }),
      [borderRadius, size],
    );

    return (
      <Flexbox
        className={cx(isDarkMode ? styles.itemContainerDark : styles.itemContainerLight, className)}
        style={{
          ...cssVariables,
          borderRadius,
          ...style,
        }}
        {...rest}
      >
        <Flexbox className={styles.content}>{children}</Flexbox>
      </Flexbox>
    );
  },
);

SpotlightCardItem.displayName = 'SpotlightCardItem';

export default SpotlightCardItem;
