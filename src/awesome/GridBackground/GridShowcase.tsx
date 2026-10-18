'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useTheme } from '@/styles/theme/scope';
import { withAlpha } from '@/utils/colorMath';

import GridBackground from './GridBackground';
import { awesomeGridShowcaseClasses } from './stable';
import { showcaseStyles } from './style';
import type { GridShowcaseProps } from './type';

const GridShowcase = memo<GridShowcaseProps>(
  ({ className, style, children, backgroundColor = '#001dff', innerProps, ...rest }) => {
    const theme = useTheme();

    return (
      <Flexbox
        {...styleProps(showcaseStyles.root, clsx(awesomeGridShowcaseClasses(), className), style)}
        {...rest}
      >
        <GridBackground
          animation
          flip
          className={awesomeGridShowcaseClasses('back')}
          colorBack={withAlpha(theme.colorText, 0.12)}
          colorFront={withAlpha(theme.colorText, 0.6)}
        />
        <Flexbox
          align={'center'}
          {...innerProps}
          {...styleProps(
            showcaseStyles.content,
            clsx(awesomeGridShowcaseClasses('content'), innerProps?.className),
            innerProps?.style,
          )}
        >
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
          className={
            styleProps(showcaseStyles.front, awesomeGridShowcaseClasses('front')).className
          }
        />
      </Flexbox>
    );
  },
);

GridShowcase.displayName = 'GridShowcase';

export default GridShowcase;
