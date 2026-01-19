'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Select } from '@base-ui/react/select';
import { cx, useThemeMode } from 'antd-style';
import {
  type ComponentProps,
  type ComponentPropsWithRef,
  cloneElement,
  isValidElement,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

import { styles as menuStyles } from '@/Menu/sharedStyle';
import { useNativeButton } from '@/hooks/useNativeButton';
import { usePortalContainer } from '@/hooks/usePortalContainer';

import { SELECT_CONTAINER_ATTR } from './constants';
import { styles, triggerVariants } from './style';
import type { SelectSize, SelectVariant } from './type';

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => cx(base, className(state));
  return cx(base, className);
};

export const SelectRoot = Select.Root;
export const SelectBackdrop = Select.Backdrop;
export const SelectSeparator = Select.Separator;

export type SelectTriggerProps = Omit<
  ComponentPropsWithRef<typeof Select.Trigger>,
  'children' | 'render'
> & {
  children: ComponentProps<typeof Select.Trigger>['children'];
  shadow?: boolean;
  size?: SelectSize;
  variant?: SelectVariant;
};

export const SelectTrigger = ({
  children,
  className,
  nativeButton,
  shadow,
  size = 'middle',
  variant,
  ref: refProp,
  ...rest
}: SelectTriggerProps) => {
  const { isDarkMode } = useThemeMode();
  const resolvedVariant = variant ?? (isDarkMode ? 'filled' : 'outlined');
  const baseClassName = triggerVariants({ shadow, size, variant: resolvedVariant });

  const { isNativeButtonTriggerElement, resolvedNativeButton } = useNativeButton({
    children,
    nativeButton,
  });

  if (isValidElement(children)) {
    return (
      <Select.Trigger
        {...rest}
        nativeButton={resolvedNativeButton}
        render={(props, state) => {
          // Base UI's trigger props include `type="button"` by default.
          // If we render into a non-<button> element, that prop is invalid and can warn.
          const resolvedProps = (() => {
            if (isNativeButtonTriggerElement) return props as any;
            // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
            const { type, ref: triggerRef, ...restProps } = props as any;
            return restProps;
          })();

          const mergedProps = mergeProps((children as any).props, resolvedProps);
          const childClassName =
            typeof (mergedProps as any).className === 'function'
              ? (mergedProps as any).className(state)
              : (mergedProps as any).className;
          const extraClassName = typeof className === 'function' ? className(state) : className;

          return cloneElement(children as any, {
            ...mergedProps,
            className: cx(baseClassName, childClassName, extraClassName),
            ref: mergeRefs([(children as any).ref, (props as any).ref, refProp]),
          });
        }}
      />
    );
  }

  return (
    <Select.Trigger
      {...rest}
      className={mergeStateClassName(baseClassName, className) as any}
      nativeButton={resolvedNativeButton}
      ref={refProp as any}
    >
      {children}
    </Select.Trigger>
  );
};

SelectTrigger.displayName = 'SelectTrigger';

export type SelectIconProps = ComponentProps<typeof Select.Icon>;

export const SelectIcon = ({ className, ...rest }: SelectIconProps) => {
  return <Select.Icon className={mergeStateClassName(styles.icon, className) as any} {...rest} />;
};

SelectIcon.displayName = 'SelectIcon';

export type SelectValueProps = ComponentProps<typeof Select.Value>;

export const SelectValue = ({ className, ...rest }: SelectValueProps) => {
  return <Select.Value className={mergeStateClassName(styles.value, className) as any} {...rest} />;
};

SelectValue.displayName = 'SelectValue';

export type SelectPortalProps = ComponentProps<typeof Select.Portal> & {
  /**
   * When `container` is not provided, it uses a shared container created by `usePortalContainer`.
   */
  container?: HTMLElement | null;
};

export const SelectPortal = ({ container, ...rest }: SelectPortalProps) => {
  const defaultContainer = usePortalContainer(SELECT_CONTAINER_ATTR);
  return <Select.Portal container={container ?? defaultContainer} {...rest} />;
};

SelectPortal.displayName = 'SelectPortal';

export type SelectPositionerProps = ComponentProps<typeof Select.Positioner>;

export const SelectPositioner = ({
  align,
  alignItemWithTrigger,
  className,
  side,
  sideOffset,
  ...rest
}: SelectPositionerProps) => {
  return (
    <Select.Positioner
      align={align ?? 'start'}
      alignItemWithTrigger={alignItemWithTrigger ?? false}
      className={mergeStateClassName(styles.positioner, className) as any}
      side={side ?? 'bottom'}
      sideOffset={sideOffset ?? 6}
      {...rest}
    />
  );
};

SelectPositioner.displayName = 'SelectPositioner';

export type SelectPopupProps = ComponentProps<typeof Select.Popup>;

export const SelectPopup = ({ className, ...rest }: SelectPopupProps) => {
  return (
    <Select.Popup
      className={mergeStateClassName(cx(menuStyles.popup, styles.popup), className) as any}
      {...rest}
    />
  );
};

SelectPopup.displayName = 'SelectPopup';

export type SelectListProps = ComponentProps<typeof Select.List>;

export const SelectList = ({ className, ...rest }: SelectListProps) => {
  return <Select.List className={mergeStateClassName(styles.list, className) as any} {...rest} />;
};

SelectList.displayName = 'SelectList';

export type SelectItemProps = ComponentProps<typeof Select.Item>;

export const SelectItem = ({ className, ...rest }: SelectItemProps) => {
  return (
    <Select.Item
      className={mergeStateClassName(cx(menuStyles.item, styles.item), className) as any}
      {...rest}
    />
  );
};

SelectItem.displayName = 'SelectItem';

export type SelectItemTextProps = ComponentProps<typeof Select.ItemText>;

export const SelectItemText = ({ className, ...rest }: SelectItemTextProps) => {
  return (
    <Select.ItemText
      className={mergeStateClassName(cx(menuStyles.label, styles.itemText), className) as any}
      {...rest}
    />
  );
};

SelectItemText.displayName = 'SelectItemText';

export type SelectItemIndicatorProps = ComponentProps<typeof Select.ItemIndicator>;

export const SelectItemIndicator = ({ className, ...rest }: SelectItemIndicatorProps) => {
  return (
    <Select.ItemIndicator
      className={mergeStateClassName(styles.itemIndicator, className) as any}
      {...rest}
    />
  );
};

SelectItemIndicator.displayName = 'SelectItemIndicator';

export type SelectGroupProps = ComponentProps<typeof Select.Group>;

export const SelectGroup = ({ className, ...rest }: SelectGroupProps) => {
  return <Select.Group className={mergeStateClassName(styles.group, className) as any} {...rest} />;
};

SelectGroup.displayName = 'SelectGroup';

export type SelectGroupLabelProps = ComponentProps<typeof Select.GroupLabel>;

export const SelectGroupLabel = ({ className, ...rest }: SelectGroupLabelProps) => {
  return (
    <Select.GroupLabel
      className={
        mergeStateClassName(cx(menuStyles.groupLabel, styles.groupLabel), className) as any
      }
      {...rest}
    />
  );
};

SelectGroupLabel.displayName = 'SelectGroupLabel';

export type SelectScrollUpArrowProps = ComponentProps<typeof Select.ScrollUpArrow>;

export const SelectScrollUpArrow = ({ className, ...rest }: SelectScrollUpArrowProps) => {
  return (
    <Select.ScrollUpArrow
      className={mergeStateClassName(styles.scrollArrow, className) as any}
      {...rest}
    />
  );
};

SelectScrollUpArrow.displayName = 'SelectScrollUpArrow';

export type SelectScrollDownArrowProps = ComponentProps<typeof Select.ScrollDownArrow>;

export const SelectScrollDownArrow = ({ className, ...rest }: SelectScrollDownArrowProps) => {
  return (
    <Select.ScrollDownArrow
      className={mergeStateClassName(styles.scrollArrow, className) as any}
      {...rest}
    />
  );
};

SelectScrollDownArrow.displayName = 'SelectScrollDownArrow';

export type SelectArrowProps = ComponentProps<typeof Select.Arrow>;

export const SelectArrow = ({ className, ...rest }: SelectArrowProps) => {
  return <Select.Arrow className={mergeStateClassName(styles.arrow, className) as any} {...rest} />;
};

SelectArrow.displayName = 'SelectArrow';

export { SELECT_CONTAINER_ATTR } from './constants';
