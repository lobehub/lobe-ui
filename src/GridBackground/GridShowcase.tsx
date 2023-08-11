import { useTheme } from 'antd-style';
import { rgba } from 'polished';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import GridBackground, { type GridBackgroundProps } from './index';

export interface GridShowcaseProps extends DivProps {
  backgroundColor?: GridBackgroundProps['backgroundColor'];
}

const GridShowcase = memo<GridShowcaseProps>(
  ({ style, children, backgroundColor = '#001dff', ...props }) => {
    const theme = useTheme();

    return (
      <div style={{ position: 'relative', ...style }} {...props}>
        <GridBackground
          animation
          colorBack={rgba(theme.colorText, 0.12)}
          colorFront={rgba(theme.colorText, 0.6)}
          flip
        />
        <Flexbox align={'center'} style={{ zIndex: 4 }}>
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
      </div>
    );
  },
);

export default GridShowcase;
