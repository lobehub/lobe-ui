'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { useTheme } from '@/styles/theme/scope';
import { withAlpha } from '@/utils/colorMath';

import GridBackground from './GridBackground';
import type { GridShowcaseProps } from './type';

const GridShowcase = memo<GridShowcaseProps>(
  ({ style, children, backgroundColor = '#001dff', innerProps, ...rest }) => {
    const theme = useTheme();

    return (
      <Flexbox style={{ position: 'relative', ...style }} {...rest}>
        <GridBackground
          animation
          flip
          colorBack={withAlpha(theme.colorText, 0.12)}
          colorFront={withAlpha(theme.colorText, 0.6)}
        />
        <Flexbox align={'center'} {...innerProps} style={{ zIndex: 4, ...innerProps?.style }}>
          {children}
        </Flexbox>
        <GridBackground
          animation
          random
          reverse
          showBackground
          backgroundColor={backgroundColor}
          colorBack={withAlpha(theme.colorText, 0.24)}
          colorFront={theme.colorText}
          style={{ zIndex: 0 }}
        />
      </Flexbox>
    );
  },
);

GridShowcase.displayName = 'GridShowcase';

export default GridShowcase;
