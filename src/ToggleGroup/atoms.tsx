'use client';

import { Toggle as BaseUIToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseUIToggleGroup } from '@base-ui/react/toggle-group';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { type ComponentProps, type CSSProperties, type FC, type ReactNode } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { toggleGroupItemMarker } from './marker.stylex';
import { toggleGroupClasses } from './stable';
import { styles } from './style';
import type { ToggleGroupSize, ToggleGroupVariant } from './type';

const rootVariantStyles = {
  borderless: styles.rootBorderless,
  outlined: styles.rootOutlined,
  segmented: styles.rootSegmented,
};

const itemSizeStyles = { middle: styles.itemMiddle, small: styles.itemSmall };

const itemSegmentedSizeStyles = {
  middle: styles.itemSegmentedMiddle,
  small: styles.itemSegmentedSmall,
};

const itemVariantStyles = {
  borderless: [styles.itemTone],
  outlined: [toggleGroupItemMarker, styles.itemOutlined, styles.itemTone],
  segmented: [styles.itemSegmented, styles.itemSegmentedTone],
};

export type ToggleGroupRootProps<Value extends string = string> = Omit<
  ComponentProps<typeof BaseUIToggleGroup<Value>>,
  'className' | 'render'
> & {
  className?: string;
  variant?: ToggleGroupVariant;
};

export const ToggleGroupRoot = <Value extends string = string>({
  className,
  variant = 'outlined',
  ...rest
}: ToggleGroupRootProps<Value>) => {
  return (
    <BaseUIToggleGroup<Value>
      data-variant={variant}
      className={
        styleProps([styles.root, rootVariantStyles[variant]], clsx(toggleGroupClasses(), className))
          .className
      }
      {...rest}
    />
  );
};

ToggleGroupRoot.displayName = 'ToggleGroupRoot';

export type ToggleGroupItemProps<Value extends string = string> = Omit<
  ComponentProps<typeof BaseUIToggle<Value>>,
  'className' | 'render'
> & {
  className?: string;
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
};

export const ToggleGroupItem = <Value extends string = string>({
  className,
  size = 'middle',
  variant = 'outlined',
  ...rest
}: ToggleGroupItemProps<Value>) => {
  const sizeStyle = variant === 'segmented' ? itemSegmentedSizeStyles[size] : itemSizeStyles[size];

  return (
    <BaseUIToggle<Value>
      {...rest}
      className={
        styleProps(
          [styles.item, focusRing.info, sizeStyle, itemVariantStyles[variant]],
          clsx(toggleGroupClasses('item'), className),
        ).className
      }
    />
  );
};

ToggleGroupItem.displayName = 'ToggleGroupItem';

interface SimpleSpanProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const ToggleGroupItemIcon: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span {...styleProps(styles.itemIcon, clsx(toggleGroupClasses('item-icon'), className), style)}>
    {children}
  </span>
);
ToggleGroupItemIcon.displayName = 'ToggleGroupItemIcon';

export const ToggleGroupItemLabel: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span
    {...styleProps(
      styles.itemLabel,
      clsx('toggle-group-item-label', toggleGroupClasses('item-label'), className),
      style,
    )}
  >
    {children}
  </span>
);
ToggleGroupItemLabel.displayName = 'ToggleGroupItemLabel';

export const toggleGroupStyles = Object.fromEntries(
  Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
) as Record<keyof typeof styles, string>;
