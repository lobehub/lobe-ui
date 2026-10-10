'use client';

import * as stylex from '@stylexjs/stylex';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

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
        width={'100%'}
        {...styleProps([styles.item, isDarkMode ? styles.itemDark : styles.itemLight], className, {
          ...cssVariables,
          borderRadius,
          ...style,
        })}
        {...rest}
      >
        <Flexbox flex={'1 1 auto'} height={'100%'} {...stylex.props(styles.content)}>
          {children}
        </Flexbox>
      </Flexbox>
    );
  },
);

SpotlightCardItem.displayName = 'SpotlightCardItem';

export default SpotlightCardItem;
