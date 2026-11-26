'use client';

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

import { a2uiToneText } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';

import { a2uiMetricStyles as styles } from './a2uiStyle';

export type A2uiTrend = 'up' | 'down' | 'flat';

const textOf = (node: ReactNode) =>
  typeof node === 'number'
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(node)
    : typeof node === 'string'
      ? node
      : undefined;

/** The direction a delta points: explicit, else read from its sign like the playground. */
export const trendOf = (delta: ReactNode, direction?: A2uiTrend): A2uiTrend | undefined => {
  if (direction) return direction;
  const text = textOf(delta);
  if (text === undefined) return delta ? 'up' : undefined;
  return text.trim().startsWith('-') ? 'down' : text ? 'up' : undefined;
};

/**
 * A KPI figure that never breaks inside a token ("$84.2k" stays whole). Its parent is an
 * inline-size container and the font scales with it (`cqi`) from the value's length, between 14px
 * and `max`. Adapted from CopilotKit a2ui-playground (MIT), `KpiValue`.
 */
export const A2uiKpiValue = ({
  className,
  max,
  value,
}: {
  className?: string;
  max: number;
  value: ReactNode;
}) => {
  const text = textOf(value);
  if (text === undefined) {
    return <span {...styleProps(styles.value, className, { fontSize: max })}>{value}</span>;
  }
  const longest = Math.max(1, ...text.split(/\s+/).map((w) => w.length));
  const phrase = text.includes(' ') && text.length > 14;
  const fit = (100 / (0.62 * Math.max(phrase ? longest + 2 : text.length, 4))).toFixed(2);
  return (
    <span
      {...styleProps([styles.value, phrase && styles.valuePhrase], className, {
        fontSize: `clamp(14px, ${fit}cqi, ${phrase ? Math.min(max, 18) : max}px)`,
      })}
    >
      {text}
    </span>
  );
};

const TREND_ICON = { down: ArrowDownRight, flat: Minus, up: ArrowUpRight } as const;
const TREND_TONE = { down: 'negative', flat: 'default', up: 'positive' } as const;

/** Delta with a trend arrow, green up / red down / muted flat. */
export const A2uiDelta = ({
  className,
  delta,
  direction,
}: {
  className?: string;
  delta?: ReactNode;
  direction?: A2uiTrend;
}) => {
  if (delta === undefined || delta === null || delta === '') return null;
  const trend = trendOf(delta, direction) ?? 'flat';
  const Icon = TREND_ICON[trend];
  return (
    <span
      {...styleProps([styles.delta, a2uiToneText[TREND_TONE[trend]]], className)}
      data-direction={trend}
    >
      <Icon size={14} {...styleProps(styles.deltaIcon)} />
      {delta}
    </span>
  );
};
