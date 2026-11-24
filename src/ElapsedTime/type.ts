import type { ReactNode, Ref } from 'react';

import type { SpanProps } from '@/types';

export type ElapsedTimeValue = Date | number | string;

export type ElapsedTimeFormat = 'short' | 'clock';

export interface UseElapsedOptions {
  /**
   * Keep ticking. Turn it off to hold the last value.
   * @default true
   */
  enabled?: boolean;
  /**
   * Milliseconds between two updates.
   * @default 1000
   */
  interval?: number;
}

export interface ElapsedTimeProps extends Omit<SpanProps, 'children'> {
  /**
   * When the work ended. With it the component shows the final duration and stops ticking.
   */
  endTime?: ElapsedTimeValue;
  /**
   * `short` reads like `850ms`, `12.3s`, `1m 05s`, `1h 02m`; `clock` reads like `00:12`,
   * `1:02:03`. Pass a function to format the milliseconds yourself.
   * @default 'short'
   */
  format?: ElapsedTimeFormat | ((milliseconds: number) => ReactNode);
  /**
   * Milliseconds between two updates. Defaults to 100 for `short`, where tenths of a
   * second are visible, and 1000 otherwise.
   */
  interval?: number;
  ref?: Ref<HTMLSpanElement>;
  /**
   * Keep ticking. Turn it off to hold the last value, e.g. once the work has finished
   * and no `endTime` is known.
   * @default true
   */
  running?: boolean;
  /**
   * When the work started. Defaults to the moment the component mounted; pass it when
   * the work outlives the component, so a remount does not restart the clock.
   */
  startTime?: ElapsedTimeValue;
}
