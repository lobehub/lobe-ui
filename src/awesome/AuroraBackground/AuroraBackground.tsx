'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import { styles } from './style';
import type { AuroraBackgroundProps } from './type';

const AuroraBackground = memo<AuroraBackgroundProps>(
  ({ ref, classNames, styles: customStyles, children, ...rest }) => {
    const { isDarkMode } = useThemeMode();
    return (
      <Flexbox ref={ref} {...rest}>
        <Flexbox {...styleProps(styles.wrapper, classNames?.wrapper, customStyles?.wrapper)}>
          <div {...stylex.props(styles.bg, isDarkMode ? styles.bgDark : styles.bgLight)} />
        </Flexbox>
        <Flexbox
          className={classNames?.content}
          flex={1}
          style={{ zIndex: 1, ...customStyles?.content }}
          width={'100%'}
        >
          {children}
        </Flexbox>
      </Flexbox>
    );
  },
);

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
