'use client';

import { cx, useTheme } from 'antd-style';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';

import { styles } from './style';
import type { SpotlightCardItemProps } from './type';

const SpotlightCardItem = memo<SpotlightCardItemProps>(
  ({ children, className, style, borderRadius, size, ...rest }) => {
    const theme = useTheme();

    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--spotlight-card-border-radius': `${borderRadius}px`,
        '--spotlight-card-size': `${size}px`,
      }),
      [borderRadius, size],
    );

    return (
      <Flexbox
        className={cx(
          theme.isDarkMode ? styles.itemContainerDark : styles.itemContainerLight,
          className,
        )}
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
