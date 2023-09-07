import { useSize } from 'ahooks';
import { shuffle } from 'lodash-es';
import { memo, useCallback, useMemo, useRef } from 'react';

import { DivProps } from '@/types';

import Grid, { type GridProps } from './Grid';
import { useStyles } from './style';

export interface GridBackgroundProps extends DivProps {
  animation?: boolean;
  animationDuration?: number;
  backgroundColor?: string;
  colorBack?: string;
  colorFront?: string;
  flip?: boolean;
  random?: boolean;
  reverse?: boolean;
  showBackground?: boolean;
  strokeWidth?: number;
}

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
    ...props
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

    const HighlightGrid = useCallback(() => {
      if (!random)
        return <Grid style={{ '--duration': `${animationDuration}s` } as any} {...gridProps} />;

      const group = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
      return (
        <>
          {shuffle(group).map((item, index) => {
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
    }, [random, animationDuration, gridProps]);

    return (
      <div
        className={cx(styles.container, className)}
        ref={ref}
        style={flip ? { transform: 'scaleY(-1)', ...style } : style}
        {...props}
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

export default GridBackground;
