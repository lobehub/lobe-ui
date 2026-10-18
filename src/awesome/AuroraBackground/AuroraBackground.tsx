'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import { awesomeAuroraBackgroundClasses } from './stable';
import { styles } from './style';
import type { AuroraBackgroundProps } from './type';

const AuroraBackground = memo<AuroraBackgroundProps>(
  ({ ref, className, classNames, styles: customStyles, children, ...rest }) => {
    const { isDarkMode } = useThemeMode();
    return (
      <Flexbox className={clsx(awesomeAuroraBackgroundClasses(), className)} ref={ref} {...rest}>
        <Flexbox
          {...styleProps(
            styles.wrapper,
            clsx(awesomeAuroraBackgroundClasses('wrapper'), classNames?.wrapper),
            customStyles?.wrapper,
          )}
        >
          <div
            {...styleProps(
              [styles.bg, isDarkMode ? styles.bgDark : styles.bgLight],
              awesomeAuroraBackgroundClasses('background'),
            )}
          />
        </Flexbox>
        <Flexbox
          flex={1}
          width={'100%'}
          {...styleProps(
            styles.content,
            clsx(awesomeAuroraBackgroundClasses('content'), classNames?.content),
            customStyles?.content,
          )}
        >
          {children}
        </Flexbox>
      </Flexbox>
    );
  },
);

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
