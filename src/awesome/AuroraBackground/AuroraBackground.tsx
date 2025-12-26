'use client';

import { cx, useTheme } from 'antd-style';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { styles } from './style';
import type { AuroraBackgroundProps } from './type';

const AuroraBackground = memo<AuroraBackgroundProps>(
  ({ ref, classNames, styles: customStyles, children, ...rest }) => {
    const theme = useTheme();
    return (
      <Flexbox ref={ref} {...rest}>
        <Flexbox className={cx(styles.wrapper, classNames?.wrapper)} style={customStyles?.wrapper}>
          <div className={theme.isDarkMode ? styles.bgDark : styles.bgLight} />
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
