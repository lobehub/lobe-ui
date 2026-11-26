import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

export type ProgressType = 'line' | 'circle';

/**
 * `a2ui`: the A2UI playground look. A line is a label + percent row over a 6px bar with an
 * optional `caption`; a circle is a card with a 76px ring, the value inside and `label` /
 * `caption` beside it.
 */
export type ProgressVariant = 'line' | 'segments' | 'inset' | 'a2ui';

export type ProgressStatus = 'normal' | 'active' | 'success' | 'exception';

export type ProgressSize = 'small' | 'middle' | 'large' | number;

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Muted line under the bar (`variant="a2ui"` line) or under the label (`variant="a2ui"` circle,
   * where it defaults to "{value} of 100"). Ignored by the other variants.
   */
  caption?: ReactNode;
  className?: string;
  format?: (percent: number) => ReactNode;
  label?: ReactNode;
  percent: number;
  ref?: Ref<HTMLDivElement>;
  segments?: number;
  showInfo?: boolean;
  size?: ProgressSize;
  status?: ProgressStatus;
  strokeColor?: string;
  style?: CSSProperties;
  type?: ProgressType;
  variant?: ProgressVariant;
}
