'use client';

import { Toggle as BaseUIToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseUIToggleGroup } from '@base-ui/react/toggle-group';
import { cx } from 'antd-style';
import { type ComponentProps, type CSSProperties, type FC, type ReactNode } from 'react';

import { itemVariants, listVariants, styles } from './style';
import type { SegmentedSize, SegmentedVariant } from './type';

export type SegmentedRootProps<Value extends string = string> = Omit<
  ComponentProps<typeof BaseUIToggleGroup<Value>>,
  'className' | 'render'
> & {
  block?: boolean;
  className?: string;
  glass?: boolean;
  shadow?: boolean;
  variant?: SegmentedVariant;
};

export const SegmentedRoot = <Value extends string = string>({
  block = false,
  className,
  glass = false,
  shadow = false,
  variant = 'filled',
  ...rest
}: SegmentedRootProps<Value>) => {
  return (
    <BaseUIToggleGroup<Value>
      className={cx(listVariants({ block, glass, shadow, variant }), className)}
      {...rest}
    />
  );
};

SegmentedRoot.displayName = 'SegmentedRoot';

export type SegmentedItemProps<Value extends string = string> = Omit<
  ComponentProps<typeof BaseUIToggle<Value>>,
  'className' | 'render'
> & {
  block?: boolean;
  className?: string;
  size?: SegmentedSize;
};

export const SegmentedItem = <Value extends string = string>({
  block = false,
  className,
  size = 'middle',
  ...rest
}: SegmentedItemProps<Value>) => {
  return <BaseUIToggle<Value> className={cx(itemVariants({ block, size }), className)} {...rest} />;
};

SegmentedItem.displayName = 'SegmentedItem';

interface SimpleSpanProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const SegmentedItemIcon: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span className={cx(styles.itemIcon, className)} style={style}>
    {children}
  </span>
);
SegmentedItemIcon.displayName = 'SegmentedItemIcon';

export const SegmentedItemLabel: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span className={cx(styles.itemLabel, className)} style={style}>
    {children}
  </span>
);
SegmentedItemLabel.displayName = 'SegmentedItemLabel';

export interface SegmentedIndicatorProps {
  className?: string;
  style?: CSSProperties;
}

export const SegmentedIndicator: FC<SegmentedIndicatorProps> = ({ className, style }) => (
  <span aria-hidden className={cx(styles.indicator, className)} style={style} />
);
SegmentedIndicator.displayName = 'SegmentedIndicator';
