'use client';

import './style.css';

import { Toggle as BaseUIToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseUIToggleGroup } from '@base-ui/react/toggle-group';
import clsx from 'clsx';
import { type ComponentProps, type CSSProperties, type FC, type ReactNode } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { segmentedMarker } from './marker.stylex';
import { styles } from './style';
import type { SegmentedSize, SegmentedVariant } from './type';

const listVariantStyles = { filled: styles.listFilled, outlined: styles.listOutlined };

const itemSizeStyles = {
  large: styles.itemLarge,
  middle: styles.itemMiddle,
  small: styles.itemSmall,
};

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
      data-variant={variant}
      className={
        styleProps(
          [
            segmentedMarker,
            styles.list,
            block && styles.listBlock,
            glass && styles.listGlass,
            shadow && styles.listShadow,
            listVariantStyles[variant],
          ],
          className,
        ).className
      }
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
  return (
    <BaseUIToggle<Value>
      className={
        styleProps(
          [styles.item, focusRing.info, block && styles.itemBlock, itemSizeStyles[size]],
          className,
        ).className
      }
      {...rest}
    />
  );
};

SegmentedItem.displayName = 'SegmentedItem';

interface SimpleSpanProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const SegmentedItemIcon: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span {...styleProps(styles.itemIcon, className, style)}>{children}</span>
);
SegmentedItemIcon.displayName = 'SegmentedItemIcon';

export const SegmentedItemLabel: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span {...styleProps(styles.itemLabel, className, style)}>{children}</span>
);
SegmentedItemLabel.displayName = 'SegmentedItemLabel';

export interface SegmentedIndicatorProps {
  className?: string;
  style?: CSSProperties;
}

export const SegmentedIndicator: FC<SegmentedIndicatorProps> = ({ className, style }) => (
  <span
    aria-hidden
    {...styleProps(styles.indicator, clsx('lobe-segmented-indicator', className), style)}
  />
);
SegmentedIndicator.displayName = 'SegmentedIndicator';
