'use client';

import * as stylex from '@stylexjs/stylex';
import { useSize } from 'ahooks';
import chroma from 'chroma-js';
import { shuffle } from 'es-toolkit/compat';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { useTheme } from '@/styles/theme/scope';

import Grid, { type GridProps } from './components/Grid';
import { styles } from './style';
import type { GridBackgroundProps } from './type';

const initialGroup = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const GridBackground = memo<GridBackgroundProps>(
  ({
    flip,
    reverse,
    showBackground,
    backgroundColor,
    random,
    animationDuration = 8,
    className,
    colorFront,
    colorBack,
    strokeWidth,
    style,
    animation,
    ...rest
  }) => {
    const ref = useRef(null);
    const size = useSize(ref);
    const theme = useTheme();

    const backgroundCssVariables = useMemo<Record<string, string>>(() => {
      if (!showBackground) return {} as Record<string, string>;

      const scale = chroma
        .bezier([theme.colorText, backgroundColor || 'blue', theme.colorBgLayout])
        .scale()
        .mode('lch')
        .correctLightness()
        .colors(6);

      return {
        '--grid-background-color-1': scale[1],
        '--grid-background-color-2': scale[2],
        '--grid-background-color-3': scale[3],
        '--grid-background-color-4': scale[4],
      };
    }, [showBackground, backgroundColor, theme.colorText, theme.colorBgLayout]);

    const gridProps: GridProps = useMemo(
      () => ({
        className: stylex.props(styles.highlight, reverse && styles.highlightReverse).className,
        color: colorFront || cssVar.colorText,
        strokeWidth,
      }),
      [reverse, colorFront, strokeWidth],
    );

    const [group, setGroup] = useState(random ? initialGroup : undefined);
    useEffect(() => {
      setGroup(random ? shuffle(initialGroup) : undefined);
    }, [random]);

    const HighlightGrid = useCallback(() => {
      if (!group)
        return <Grid style={{ '--duration': `${animationDuration}s` } as any} {...gridProps} />;

      return (
        <>
          {group.map((item, index) => {
            return (
              <Grid
                key={item}
                linePick={item}
                style={
                  {
                    '--delay': `${index + Math.random()}s`,
                    '--duration': `${animationDuration}s`,
                  } as any
                }
                {...gridProps}
              />
            );
          })}
        </>
      );
    }, [group, animationDuration, gridProps]);

    return (
      <div
        {...styleProps(
          styles.container,
          className,
          flip ? { transform: 'scaleY(-1)', ...style } : style,
        )}
        ref={ref}
        {...rest}
      >
        <Grid
          color={colorBack || cssVar.colorBorder}
          strokeWidth={strokeWidth}
          style={{ zIndex: 2 }}
        />
        {animation && <HighlightGrid />}
        {showBackground && (
          <div
            {...stylex.props(styles.backgroundContainer)}
            style={{
              ...(size ? { fontSize: size.width / 80 } : {}),
              ...backgroundCssVariables,
            }}
          >
            <div {...stylex.props(styles.backgroundShape)} />
          </div>
        )}
      </div>
    );
  },
);

GridBackground.displayName = 'GridBackground';

export default GridBackground;
