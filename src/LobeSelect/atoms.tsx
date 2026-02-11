'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Select } from '@base-ui/react/select';
import { cx, useThemeMode } from 'antd-style';
import {
  cloneElement,
  type ComponentProps,
  type ComponentPropsWithRef,
  isValidElement,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useNativeButton } from '@/hooks/useNativeButton';
import { styles as menuStyles } from '@/Menu/sharedStyle';
import { useAppElement } from '@/ThemeProvider';

import { styles, triggerVariants } from './style';
import { type LobeSelectSize, type LobeSelectVariant } from './type';

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => cx(base, className(state));
  return cx(base, className);
};

export const LobeSelectRoot = Select.Root;
export const LobeSelectBackdrop = Select.Backdrop;
export const LobeSelectSeparator = Select.Separator;

export type LobeSelectTriggerProps = Omit<
  ComponentPropsWithRef<typeof Select.Trigger>,
  'children' | 'render'
> & {
  children: ComponentProps<typeof Select.Trigger>['children'];
  shadow?: boolean;
  size?: LobeSelectSize;
  variant?: LobeSelectVariant;
};

export const LobeSelectTrigger = ({
  children,
  className,
  nativeButton,
  shadow,
  size = 'middle',
  variant,
  ref: refProp,
  ...rest
}: LobeSelectTriggerProps) => {
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

LobeSelectTrigger.displayName = 'LobeSelectTrigger';

export type LobeSelectIconProps = ComponentProps<typeof Select.Icon>;

export const LobeSelectIcon = ({ className, ...rest }: LobeSelectIconProps) => {
  return <Select.Icon className={mergeStateClassName(styles.icon, className) as any} {...rest} />;
};

LobeSelectIcon.displayName = 'LobeSelectIcon';

export type LobeSelectValueProps = ComponentProps<typeof Select.Value>;

export const LobeSelectValue = ({ className, ...rest }: LobeSelectValueProps) => {
  return <Select.Value className={mergeStateClassName(styles.value, className) as any} {...rest} />;
};

LobeSelectValue.displayName = 'LobeSelectValue';

export type LobeSelectPortalProps = ComponentProps<typeof Select.Portal> & {
  /**
   * When `container` is not provided, it uses a shared container created by `usePortalContainer`.
   */
  container?: HTMLElement | null;
};

export const LobeSelectPortal = ({ container, ...rest }: LobeSelectPortalProps) => {
  const appElement = useAppElement();
  return <Select.Portal container={container ?? appElement ?? undefined} {...rest} />;
};

LobeSelectPortal.displayName = 'LobeSelectPortal';

export type LobeSelectPositionerProps = ComponentProps<typeof Select.Positioner>;

export const LobeSelectPositioner = ({
  align,
  alignItemWithTrigger,
  className,
  side,
  sideOffset,
  ...rest
}: LobeSelectPositionerProps) => {
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

LobeSelectPositioner.displayName = 'LobeSelectPositioner';

export type LobeSelectPopupProps = ComponentProps<typeof Select.Popup>;

export const LobeSelectPopup = ({ className, ...rest }: LobeSelectPopupProps) => {
  return (
    <Select.Popup
      className={mergeStateClassName(cx(menuStyles.popup, styles.popup), className) as any}
      {...rest}
    />
  );
};

LobeSelectPopup.displayName = 'LobeSelectPopup';

export type LobeSelectListProps = ComponentProps<typeof Select.List>;

export const LobeSelectList = ({ className, ...rest }: LobeSelectListProps) => {
  return <Select.List className={mergeStateClassName(styles.list, className) as any} {...rest} />;
};

LobeSelectList.displayName = 'LobeSelectList';

export type LobeSelectItemProps = ComponentProps<typeof Select.Item>;

export const LobeSelectItem = ({ className, ...rest }: LobeSelectItemProps) => {
  return (
    <Select.Item
      className={mergeStateClassName(cx(menuStyles.item, styles.item), className) as any}
      {...rest}
    />
  );
};

LobeSelectItem.displayName = 'LobeSelectItem';

export type LobeSelectItemTextProps = ComponentProps<typeof Select.ItemText>;

export const LobeSelectItemText = ({ className, ...rest }: LobeSelectItemTextProps) => {
  return (
    <Select.ItemText
      className={mergeStateClassName(cx(menuStyles.label, styles.itemText), className) as any}
      {...rest}
    />
  );
};

LobeSelectItemText.displayName = 'LobeSelectItemText';

export type LobeSelectItemIndicatorProps = ComponentProps<typeof Select.ItemIndicator>;

export const LobeSelectItemIndicator = ({ className, ...rest }: LobeSelectItemIndicatorProps) => {
  return (
    <Select.ItemIndicator
      className={mergeStateClassName(styles.itemIndicator, className) as any}
      {...rest}
    />
  );
};

LobeSelectItemIndicator.displayName = 'LobeSelectItemIndicator';

export type LobeSelectGroupProps = ComponentProps<typeof Select.Group>;

export const LobeSelectGroup = ({ className, ...rest }: LobeSelectGroupProps) => {
  return <Select.Group className={mergeStateClassName(styles.group, className) as any} {...rest} />;
};

LobeSelectGroup.displayName = 'LobeSelectGroup';

export type LobeSelectGroupLabelProps = ComponentProps<typeof Select.GroupLabel>;

export const LobeSelectGroupLabel = ({ className, ...rest }: LobeSelectGroupLabelProps) => {
  return (
    <Select.GroupLabel
      className={
        mergeStateClassName(cx(menuStyles.groupLabel, styles.groupLabel), className) as any
      }
      {...rest}
    />
  );
};

LobeSelectGroupLabel.displayName = 'LobeSelectGroupLabel';

export type LobeSelectScrollUpArrowProps = ComponentProps<typeof Select.ScrollUpArrow>;

export const LobeSelectScrollUpArrow = ({ className, ...rest }: LobeSelectScrollUpArrowProps) => {
  return (
    <Select.ScrollUpArrow
      className={mergeStateClassName(styles.scrollArrow, className) as any}
      {...rest}
    />
  );
};

LobeSelectScrollUpArrow.displayName = 'LobeSelectScrollUpArrow';

export type LobeSelectScrollDownArrowProps = ComponentProps<typeof Select.ScrollDownArrow>;

export const LobeSelectScrollDownArrow = ({
  className,
  ...rest
}: LobeSelectScrollDownArrowProps) => {
  return (
    <Select.ScrollDownArrow
      className={mergeStateClassName(styles.scrollArrow, className) as any}
      {...rest}
    />
  );
};

LobeSelectScrollDownArrow.displayName = 'LobeSelectScrollDownArrow';

export type LobeSelectArrowProps = ComponentProps<typeof Select.Arrow>;

export const LobeSelectArrow = ({ className, ...rest }: LobeSelectArrowProps) => {
  return <Select.Arrow className={mergeStateClassName(styles.arrow, className) as any} {...rest} />;
};

LobeSelectArrow.displayName = 'LobeSelectArrow';
