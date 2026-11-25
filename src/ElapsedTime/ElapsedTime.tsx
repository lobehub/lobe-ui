'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { elapsedTimeClasses } from './stable';
import { styles } from './style';
import type { ElapsedTimeProps } from './type';
import { formatElapsed, toTimestamp, useElapsed } from './useElapsed';

const ElapsedTime: FC<ElapsedTimeProps> = ({
  className,
  endTime,
  format = 'short',
  interval,
  ref,
  running = true,
  startTime,
  style,
  ...rest
}) => {
  const start = toTimestamp(startTime);
  const end = toTimestamp(endTime);
  const settled = start !== undefined && end !== undefined;
  const ticking = running && !settled;
  const live = useElapsed(startTime, {
    enabled: ticking,
    interval: interval ?? (format === 'short' ? 100 : 1000),
  });
  const milliseconds = settled ? Math.max(0, end - start) : live;

  return (
    <span
      ref={ref}
      {...styleProps(styles.root, clsx(elapsedTimeClasses(), className), style)}
      {...toDataAttributes({ running: ticking })}
      {...rest}
    >
      {typeof format === 'function' ? format(milliseconds) : formatElapsed(milliseconds, format)}
    </span>
  );
};

ElapsedTime.displayName = 'ElapsedTime';

export default ElapsedTime;
