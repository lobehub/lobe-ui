'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Select } from '@base-ui/react/select';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import {
  cloneElement,
  type ComponentProps,
  type ComponentPropsWithRef,
  isValidElement,
} from 'react';

import { useAppElement } from '@/ConfigProvider/AppElementContext';
import { menuClassNames, menuStyles } from '@/DropdownMenu/sharedStyle';
import { useNativeButton } from '@/hooks/useNativeButton';
import { getFloatingCollisionPadding } from '@/internal/floating';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { getElementRef } from '@/utils/getElementRef';
import { mergeRefs, useMergeRefs } from '@/utils/mergeRefs';

import { useLayerZIndex } from '../internal/zIndex';
import { selectClasses } from './stable';
import { styles, triggerStyles } from './style';
import { type SelectSize, type SelectVariant } from './type';

const mergeStateClassName = <TState,>(
  base: Parameters<typeof styleProps>[0],
  className: string | ((state: TState) => string | undefined) | undefined,
  extra?: string,
) => {
  const baseClassName = styleProps(base, extra).className;
  if (typeof className === 'function')
    return (state: TState) => clsx(baseClassName, className(state));
  return clsx(baseClassName, className);
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
  const triggerStyle = triggerStyles({ shadow, size, variant: resolvedVariant });
  const baseClassName = stylex.props(triggerStyle).className;

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
            // eslint-disable-next-line unused-imports/no-unused-vars
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
            className: clsx(baseClassName, selectClasses(), childClassName, extraClassName),
            ref: mergeRefs([getElementRef(children), (props as any).ref, refProp]),
          });
        }}
      />
    );
  }

  return (
    <Select.Trigger
      {...rest}
      className={mergeStateClassName([triggerStyle], className, selectClasses()) as any}
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
  return (
    <Select.Icon
      className={mergeStateClassName([styles.icon], className, selectClasses('icon')) as any}
      {...rest}
    />
  );
};

SelectIcon.displayName = 'SelectIcon';

export type SelectValueProps = ComponentProps<typeof Select.Value>;

export const SelectValue = ({ className, ...rest }: SelectValueProps) => {
  return (
    <Select.Value
      className={mergeStateClassName([styles.value], className, selectClasses('value')) as any}
      {...rest}
    />
  );
};

SelectValue.displayName = 'SelectValue';

export type SelectPortalProps = ComponentProps<typeof Select.Portal> & {
  /**
   * When `container` is not provided, it uses a shared container created by `usePortalContainer`.
   */
  container?: HTMLElement | null;
};

export const SelectPortal = ({ container, ...rest }: SelectPortalProps) => {
  const appElement = useAppElement();
  return <Select.Portal container={container ?? appElement ?? undefined} {...rest} />;
};

SelectPortal.displayName = 'SelectPortal';

export type SelectPositionerProps = ComponentProps<typeof Select.Positioner>;

export const SelectPositioner = ({
  align,
  alignItemWithTrigger,
  className,
  collisionPadding,
  side,
  sideOffset,
  style,
  ref: forwardedRef,
  ...rest
}: SelectPositionerProps) => {
  const explicitZIndex =
    typeof style !== 'function' && style?.zIndex != null && typeof style.zIndex === 'number'
      ? style.zIndex
      : undefined;
  const { zIndex, ref: zRef } = useLayerZIndex<HTMLDivElement>('floating', explicitZIndex);
  const composedRef = useMergeRefs([forwardedRef, zRef]);

  const resolvedStyle =
    typeof style === 'function'
      ? (state: any) => ({ zIndex, ...style(state) })
      : { zIndex, ...style };

  return (
    <Select.Positioner
      align={align ?? 'start'}
      alignItemWithTrigger={alignItemWithTrigger ?? false}
      collisionPadding={collisionPadding ?? getFloatingCollisionPadding()}
      ref={composedRef as any}
      side={side ?? 'bottom'}
      sideOffset={sideOffset ?? 6}
      style={resolvedStyle}
      className={
        mergeStateClassName([styles.positioner], className, selectClasses('positioner')) as any
      }
      {...rest}
    />
  );
};

SelectPositioner.displayName = 'SelectPositioner';

export type SelectPopupProps = ComponentProps<typeof Select.Popup>;

export const SelectPopup = ({ className, ...rest }: SelectPopupProps) => {
  return (
    <Select.Popup
      className={
        mergeStateClassName(
          [menuStyles.popup, styles.popup],
          className,
          clsx(menuClassNames.popup, selectClasses('popup')),
        ) as any
      }
      {...rest}
    />
  );
};

SelectPopup.displayName = 'SelectPopup';

export type SelectListProps = ComponentProps<typeof Select.List>;

export const SelectList = ({ className, ...rest }: SelectListProps) => {
  return (
    <Select.List
      className={mergeStateClassName([styles.list], className, selectClasses('list')) as any}
      {...rest}
    />
  );
};

SelectList.displayName = 'SelectList';

export type SelectItemProps = ComponentProps<typeof Select.Item>;

export const SelectItem = ({ className, ...rest }: SelectItemProps) => {
  return (
    <Select.Item
      className={mergeStateClassName([menuStyles.item], className, selectClasses('option')) as any}
      {...rest}
    />
  );
};

SelectItem.displayName = 'SelectItem';

export type SelectItemTextProps = ComponentProps<typeof Select.ItemText>;

export const SelectItemText = ({ className, ...rest }: SelectItemTextProps) => {
  return (
    <Select.ItemText
      className={
        mergeStateClassName(
          [menuStyles.label],
          className,
          clsx(menuClassNames.label, selectClasses('item-text')),
        ) as any
      }
      {...rest}
    />
  );
};

SelectItemText.displayName = 'SelectItemText';

export type SelectItemIndicatorProps = ComponentProps<typeof Select.ItemIndicator>;

export const SelectItemIndicator = ({ className, ...rest }: SelectItemIndicatorProps) => {
  return (
    <Select.ItemIndicator
      className={
        mergeStateClassName(
          [styles.itemIndicator],
          className,
          selectClasses('item-indicator'),
        ) as any
      }
      {...rest}
    />
  );
};

SelectItemIndicator.displayName = 'SelectItemIndicator';

export type SelectGroupProps = ComponentProps<typeof Select.Group>;

export const SelectGroup = ({ className, ...rest }: SelectGroupProps) => {
  return (
    <Select.Group
      className={mergeStateClassName([], className, selectClasses('group')) as any}
      {...rest}
    />
  );
};

SelectGroup.displayName = 'SelectGroup';

export type SelectGroupLabelProps = ComponentProps<typeof Select.GroupLabel>;

export const SelectGroupLabel = ({ className, ...rest }: SelectGroupLabelProps) => {
  return (
    <Select.GroupLabel
      className={
        mergeStateClassName([menuStyles.groupLabel], className, selectClasses('group-label')) as any
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
      className={
        mergeStateClassName(
          [styles.scrollArrow],
          className,
          selectClasses('scroll-up-arrow'),
        ) as any
      }
      {...rest}
    />
  );
};

SelectScrollUpArrow.displayName = 'SelectScrollUpArrow';

export type SelectScrollDownArrowProps = ComponentProps<typeof Select.ScrollDownArrow>;

export const SelectScrollDownArrow = ({ className, ...rest }: SelectScrollDownArrowProps) => {
  return (
    <Select.ScrollDownArrow
      className={
        mergeStateClassName(
          [styles.scrollArrow],
          className,
          selectClasses('scroll-down-arrow'),
        ) as any
      }
      {...rest}
    />
  );
};

SelectScrollDownArrow.displayName = 'SelectScrollDownArrow';

export type SelectArrowProps = ComponentProps<typeof Select.Arrow>;

export const SelectArrow = ({ className, ...rest }: SelectArrowProps) => {
  return (
    <Select.Arrow
      className={
        mergeStateClassName(
          [styles.arrow],
          className,
          clsx('lobe-select-arrow', selectClasses('arrow')),
        ) as any
      }
      {...rest}
    />
  );
};

SelectArrow.displayName = 'SelectArrow';
