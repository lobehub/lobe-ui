'use client';

import { useSize } from 'ahooks';
import { shuffle } from 'lodash-es';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Grid, { type GridProps } from './components/Grid';
import { useStyles } from './style';
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
    const { styles, cx, theme } = useStyles({ backgroundColor, reverse });

    const gridProps: GridProps = useMemo(
      () => ({
        className: styles.highlight,
        color: colorFront || theme.colorText,
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
        className={cx(styles.container, className)}
        ref={ref}
        style={flip ? { transform: 'scaleY(-1)', ...style } : style}
        {...rest}
      >
        <Grid
          color={colorBack || theme.colorBorder}
          strokeWidth={strokeWidth}
          style={{ zIndex: 2 }}
        />
        {animation && <HighlightGrid />}
        {showBackground && (
          <div
            className={styles.backgroundContainer}
            style={size ? { fontSize: size.width / 80 } : {}}
          >
            <div className={styles.background} />
          </div>
        )}
      </div>
    );
  },
);

GridBackground.displayName = 'GridBackground';

export default GridBackground;
