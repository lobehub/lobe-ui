'use client';

import { useTheme } from 'antd-style';
import { rgba } from 'polished';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import GridBackground from './GridBackground';
import type { GridShowcaseProps } from './type';

const GridShowcase = memo<GridShowcaseProps>(
  ({ style, children, backgroundColor = '#001dff', innerProps, ...rest }) => {
    const theme = useTheme();

    return (
      <Flexbox style={{ position: 'relative', ...style }} {...rest}>
        <GridBackground
          animation
          colorBack={rgba(theme.colorText, 0.12)}
          colorFront={rgba(theme.colorText, 0.6)}
          flip
        />
        <Flexbox align={'center'} {...innerProps} style={{ zIndex: 4, ...innerProps?.style }}>
          {children}
        </Flexbox>
        <GridBackground
          animation
          backgroundColor={backgroundColor}
          colorBack={rgba(theme.colorText, 0.24)}
          colorFront={theme.colorText}
          random
          reverse
          showBackground
          style={{ zIndex: 0 }}
        />
      </Flexbox>
    );
  },
);

GridShowcase.displayName = 'GridShowcase';

export default GridShowcase;
