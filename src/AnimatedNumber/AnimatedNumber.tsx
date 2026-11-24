'use client';

import { type FC, useEffect, useRef, useState } from 'react';

import type { AnimatedNumberProps } from './type';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts the displayed number up or down to `value` whenever it changes. The first
 * render shows the initial value as is, so only later updates animate, such as a
 * token total ticking up while a response streams.
 *
 * It renders a text node and nothing else, so it inherits the typography of
 * wherever it is placed; pair it with `font-variant-numeric: tabular-nums` to keep
 * the width steady.
 */
const AnimatedNumber: FC<AnimatedNumberProps> = ({ duration = 500, formatter, value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  // Where the next transition starts from: the value currently on screen, so a
  // change that lands mid-flight continues from there instead of jumping back.
  const currentRef = useRef(value);

  useEffect(() => {
    const from = currentRef.current;
    const diff = value - from;
    if (diff === 0) return;

    if (duration <= 0 || prefersReducedMotion()) {
      currentRef.current = value;
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    let startTime: number | undefined;

    const tick = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutCubic
      const current = progress < 1 ? from + diff * (1 - (1 - progress) ** 3) : value;
      currentRef.current = current;
      setDisplayValue(current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return formatter ? formatter(displayValue) : Math.round(displayValue).toLocaleString();
};

AnimatedNumber.displayName = 'AnimatedNumber';

export default AnimatedNumber;
