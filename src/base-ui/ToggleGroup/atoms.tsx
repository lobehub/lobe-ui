'use client';

import { Toggle as BaseUIToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseUIToggleGroup } from '@base-ui/react/toggle-group';
import { cx } from 'antd-style';
import { type ComponentProps, type CSSProperties, type FC, type ReactNode } from 'react';

import { itemVariants, rootVariants, styles } from './style';
import type { ToggleGroupSize, ToggleGroupVariant } from './type';

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
    <BaseUIToggleGroup<Value> className={cx(rootVariants({ variant }), className)} {...rest} />
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
  return (
    <BaseUIToggle<Value> className={cx(itemVariants({ size, variant }), className)} {...rest} />
  );
};

ToggleGroupItem.displayName = 'ToggleGroupItem';

interface SimpleSpanProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const ToggleGroupItemIcon: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span className={cx(styles.itemIcon, className)} style={style}>
    {children}
  </span>
);
ToggleGroupItemIcon.displayName = 'ToggleGroupItemIcon';

export const ToggleGroupItemLabel: FC<SimpleSpanProps> = ({ children, className, style }) => (
  <span className={cx('toggle-group-item-label', styles.itemLabel, className)} style={style}>
    {children}
  </span>
);
ToggleGroupItemLabel.displayName = 'ToggleGroupItemLabel';

export { styles as toggleGroupStyles } from './style';
