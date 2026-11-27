'use client';

import clsx from 'clsx';
import type { FC } from 'react';

import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { styles } from './a2uiStyle';
import { skeletonClasses } from './stable';
import type { SkeletonProps } from './type';

/** Bar heights of the chart placeholder, in percent of the plot. */
const CHART_BARS = [40, 65, 50, 80, 58, 90, 72];
/** Line widths of the card placeholder. */
const CARD_LINES = ['33.333%', '100%', '80%'];

/**
 * The A2UI playground skeleton. Adapted from CopilotKit a2ui-playground (MIT),
 * `renderers/feedback.tsx` Skeleton: pulsing text lines, a card (avatar and three lines) or a
 * chart (seven bars).
 */
const A2uiSkeleton: FC<
  Omit<SkeletonProps, 'animated' | 'height' | 'radius' | 'variant' | 'width'>
> = ({ className, lines = 3, type = 'text', style, ...rest }) => {
  const root = clsx(skeletonClasses(), className);
  const data = toDataAttributes({ type, variant: 'a2ui' });

  if (type === 'chart')
    return (
      <div
        aria-hidden
        {...rest}
        {...data}
        {...styleProps([a2uiStyles.card, styles.chart], root, style)}
      >
        {CHART_BARS.map((h, i) => (
          <div
            key={i}
            {...styleProps([styles.shimmer, styles.bar], skeletonClasses('bar'), {
              height: `${h}%`,
            })}
          />
        ))}
      </div>
    );

  if (type === 'card')
    return (
      <div
        aria-hidden
        {...rest}
        {...data}
        {...styleProps([a2uiStyles.card, styles.card], root, style)}
      >
        <div {...styleProps([styles.shimmer, styles.avatar], skeletonClasses('avatar'))} />
        <div {...styleProps(styles.body, skeletonClasses('body'))}>
          {CARD_LINES.map((w, i) => (
            <div
              key={i}
              {...styleProps([styles.shimmer, styles.line], skeletonClasses('line'), { width: w })}
            />
          ))}
        </div>
      </div>
    );

  const count = Math.max(1, Math.floor(lines));
  return (
    <div aria-hidden {...rest} {...data} {...styleProps(styles.text, root, style)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          {...styleProps([styles.shimmer, styles.line], skeletonClasses('line'), {
            width: i === count - 1 ? '60%' : '100%',
          })}
        />
      ))}
    </div>
  );
};

A2uiSkeleton.displayName = 'A2uiSkeleton';

export default A2uiSkeleton;
