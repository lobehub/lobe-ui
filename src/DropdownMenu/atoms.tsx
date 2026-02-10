'use client';

import { Menu } from '@base-ui/react/menu';
import { mergeProps } from '@base-ui/react/merge-props';
import { Switch } from 'antd';
import { cx } from 'antd-style';
import clsx from 'clsx';
import type React from 'react';
import { cloneElement, isValidElement, useCallback, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { FloatingLayerProvider } from '@/hooks/useFloatingLayer';
import { useNativeButton } from '@/hooks/useNativeButton';
import { styles } from '@/Menu/sharedStyle';
import { CLASSNAMES } from '@/styles/classNames';
import { placementMap } from '@/utils/placement';

import { type DropdownMenuPlacement } from './type';

export const DROPDOWN_MENU_CONTAINER_ATTR = 'data-lobe-ui-dropdown-menu-container';

export const DropdownMenuRoot: typeof Menu.Root = (props) => <Menu.Root modal={false} {...props} />;
export const DropdownMenuSubmenuRoot = Menu.SubmenuRoot;
export const DropdownMenuCheckboxItemIndicator = Menu.CheckboxItemIndicator;

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => cx(base, className(state));
  return cx(base, className);
};

export type DropdownMenuTriggerProps = Omit<
  React.ComponentPropsWithRef<typeof Menu.Trigger>,
  'children' | 'render'
> & {
  children: React.ReactNode;
};

export const DropdownMenuTrigger = ({
  children,
  className,
  nativeButton,
  ref: refProp,
  ...rest
}: DropdownMenuTriggerProps) => {
  const { isNativeButtonTriggerElement, resolvedNativeButton } = useNativeButton({
    children,
    nativeButton,
  });

  const renderer = (props: any) => {
    // Base UI's trigger props include `type="button"` by default.
    // If we render into a non-<button> element, that prop is invalid and can warn.
    const resolvedProps = (() => {
      if (isNativeButtonTriggerElement) return props as any;
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { type, ...restProps } = props as any;
      return restProps;
    })();

    const mergedProps = mergeProps((children as any).props, resolvedProps);
    return cloneElement(children as any, {
      ...mergedProps,
      className: clsx(CLASSNAMES.DropdownMenuTrigger, className, mergedProps.className),
      ref: mergeRefs([(children as any).ref, (props as any).ref, refProp]),
    });
  };

  if (isValidElement(children)) {
    return <Menu.Trigger {...rest} nativeButton={resolvedNativeButton} render={renderer as any} />;
  }

  return (
    <Menu.Trigger
      {...rest}
      className={clsx(CLASSNAMES.DropdownMenuTrigger, className)}
      nativeButton={resolvedNativeButton}
      ref={refProp as any}
    >
      {children}
    </Menu.Trigger>
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export type DropdownMenuPortalProps = React.ComponentProps<typeof Menu.Portal> & {
  /**
   * When `container` is not provided, it uses a shared container created by `usePortalContainer`.
   */
  container?: HTMLElement | null;
};

export const DropdownMenuPortal = ({ container, ...rest }: DropdownMenuPortalProps) => {
  return <Menu.Portal container={container ?? undefined} {...rest} />;
};

DropdownMenuPortal.displayName = 'DropdownMenuPortal';

export type DropdownMenuPositionerProps = React.ComponentProps<typeof Menu.Positioner> & {
  hoverTrigger?: boolean;
  placement?: DropdownMenuPlacement;
};

export const DropdownMenuPositioner = ({
  className,
  placement,
  hoverTrigger,
  align,
  side,
  sideOffset,
  children,
  ...rest
}: DropdownMenuPositionerProps) => {
  const placementConfig = placement ? placementMap[placement] : undefined;
  const [positionerNode, setPositionerNode] = useState<HTMLDivElement | null>(null);

  return (
    <Menu.Positioner
      {...rest}
      align={align ?? placementConfig?.align}
      className={mergeStateClassName(styles.positioner, className as any) as any}
      data-hover-trigger={hoverTrigger || undefined}
      data-placement={placement}
      ref={setPositionerNode}
      side={side ?? placementConfig?.side}
      sideOffset={sideOffset ?? (placementConfig ? 6 : undefined)}
    >
      <FloatingLayerProvider value={positionerNode}>{children}</FloatingLayerProvider>
    </Menu.Positioner>
  );
};

DropdownMenuPositioner.displayName = 'DropdownMenuPositioner';

export type DropdownMenuPopupProps = React.ComponentProps<typeof Menu.Popup>;

export const DropdownMenuPopup = ({ className, ...rest }: DropdownMenuPopupProps) => {
  return (
    <Menu.Popup {...rest} className={mergeStateClassName(styles.popup, className as any) as any} />
  );
};

DropdownMenuPopup.displayName = 'DropdownMenuPopup';

export type DropdownMenuItemProps = React.ComponentProps<typeof Menu.Item> & { danger?: boolean };

export const DropdownMenuItem = ({ className, danger, ...rest }: DropdownMenuItemProps) => {
  return (
    <Menu.Item
      {...rest}
      className={(state) =>
        cx(
          styles.item,
          danger && styles.danger,
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
};

DropdownMenuItem.displayName = 'DropdownMenuItem';

export type DropdownMenuCheckboxItemProps = React.ComponentProps<typeof Menu.CheckboxItem> & {
  danger?: boolean;
};

export const DropdownMenuCheckboxItemPrimitive = ({
  className,
  danger,
  ...rest
}: DropdownMenuCheckboxItemProps) => {
  return (
    <Menu.CheckboxItem
      {...rest}
      className={(state) =>
        cx(
          styles.item,
          danger && styles.danger,
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
};

DropdownMenuCheckboxItemPrimitive.displayName = 'DropdownMenuCheckboxItemPrimitive';

export type DropdownMenuSeparatorProps = React.ComponentProps<typeof Menu.Separator>;

export const DropdownMenuSeparator = ({ className, ...rest }: DropdownMenuSeparatorProps) => {
  return (
    <Menu.Separator
      {...rest}
      className={(state) =>
        cx(styles.separator, typeof className === 'function' ? className(state) : className)
      }
    />
  );
};

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuGroup = Menu.Group;

export type DropdownMenuGroupLabelProps = React.ComponentProps<typeof Menu.GroupLabel>;

export const DropdownMenuGroupLabel = ({ className, ...rest }: DropdownMenuGroupLabelProps) => {
  return (
    <Menu.GroupLabel
      {...rest}
      className={(state) =>
        cx(styles.groupLabel, typeof className === 'function' ? className(state) : className)
      }
    />
  );
};

DropdownMenuGroupLabel.displayName = 'DropdownMenuGroupLabel';

export type DropdownMenuSubmenuTriggerProps = React.ComponentProps<typeof Menu.SubmenuTrigger> & {
  danger?: boolean;
};

export const DropdownMenuSubmenuTrigger = ({
  className,
  danger,
  ...rest
}: DropdownMenuSubmenuTriggerProps) => {
  return (
    <Menu.SubmenuTrigger
      {...rest}
      className={(state) =>
        cx(
          styles.item,
          danger && styles.danger,
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
};

DropdownMenuSubmenuTrigger.displayName = 'DropdownMenuSubmenuTrigger';

export type DropdownMenuItemContentProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownMenuItemContent = ({ className, ...rest }: DropdownMenuItemContentProps) => {
  return <div {...rest} className={cx(styles.itemContent, className)} />;
};

DropdownMenuItemContent.displayName = 'DropdownMenuItemContent';

export type DropdownMenuItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemIcon = ({ className, ...rest }: DropdownMenuItemIconProps) => {
  return <span {...rest} className={cx(styles.icon, className)} />;
};

DropdownMenuItemIcon.displayName = 'DropdownMenuItemIcon';

export type DropdownMenuItemLabelGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownMenuItemLabelGroup = ({
  className,
  ...rest
}: DropdownMenuItemLabelGroupProps) => {
  return <div {...rest} className={cx(styles.labelGroup, className)} />;
};

DropdownMenuItemLabelGroup.displayName = 'DropdownMenuItemLabelGroup';

export type DropdownMenuItemLabelProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemLabel = ({ className, ...rest }: DropdownMenuItemLabelProps) => {
  return <span {...rest} className={cx(styles.label, className)} />;
};

DropdownMenuItemLabel.displayName = 'DropdownMenuItemLabel';

export type DropdownMenuItemDescProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemDesc = ({ className, ...rest }: DropdownMenuItemDescProps) => {
  return <span {...rest} className={cx(styles.desc, className)} />;
};

DropdownMenuItemDesc.displayName = 'DropdownMenuItemDesc';

export type DropdownMenuItemExtraProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemExtra = ({ className, ...rest }: DropdownMenuItemExtraProps) => {
  return <span {...rest} className={cx(styles.extra, className)} />;
};

DropdownMenuItemExtra.displayName = 'DropdownMenuItemExtra';

export type DropdownMenuSubmenuArrowProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuSubmenuArrow = ({ className, ...rest }: DropdownMenuSubmenuArrowProps) => {
  return <span {...rest} className={cx(styles.submenuArrow, className)} />;
};

DropdownMenuSubmenuArrow.displayName = 'DropdownMenuSubmenuArrow';

export type DropdownMenuSwitchItemProps = Omit<
  React.ComponentProps<typeof Menu.Item>,
  'onClick'
> & {
  checked?: boolean;
  closeOnClick?: boolean;
  danger?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const DropdownMenuSwitchItem = ({
  checked: checkedProp,
  className,
  closeOnClick = false,
  danger,
  defaultChecked,
  disabled,
  onCheckedChange,
  children,
  ...rest
}: DropdownMenuSwitchItemProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  const handleCheckedChange = useCallback(
    (newChecked: boolean) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    },
    [isControlled, onCheckedChange],
  );

  return (
    <Menu.Item
      {...rest}
      closeOnClick={closeOnClick}
      disabled={disabled}
      className={(state) =>
        cx(
          styles.item,
          danger && styles.danger,
          typeof className === 'function' ? className(state) : className,
        )
      }
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          handleCheckedChange(!checked);
        }
      }}
    >
      {children}
      <Switch
        checked={checked}
        disabled={disabled}
        size="small"
        style={{ marginInlineStart: 16 }}
        onChange={handleCheckedChange}
        onClick={(_, e) => e.stopPropagation()}
      />
    </Menu.Item>
  );
};

DropdownMenuSwitchItem.displayName = 'DropdownMenuSwitchItem';
