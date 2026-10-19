'use client';

import { Menu } from '@base-ui/react/menu';
import { mergeProps } from '@base-ui/react/merge-props';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import type React from 'react';
import { cloneElement, isValidElement, useCallback, useState } from 'react';

import { useAppElement } from '@/ConfigProvider/AppElementContext';
import { FloatingLayerProvider } from '@/hooks/useFloatingLayer';
import { useNativeButton } from '@/hooks/useNativeButton';
import { getFloatingCollisionPadding } from '@/internal/floating';
import { MenuVirtualList, type VirtualListProps } from '@/internal/virtual';
import { CLASSNAMES } from '@/styles/classNames';
import { type styleProps } from '@/styles/stylex/props';
import Switch from '@/Switch';
import { getElementRef } from '@/utils/getElementRef';
import { mergeRefs, useMergeRefs } from '@/utils/mergeRefs';
import { placementMap } from '@/utils/placement';

import { useLayerZIndex } from '../internal/zIndex';
import { dropdownMenuClasses } from './stable';
import { menuClassNames, menuStyles } from './style';
import { type DropdownMenuPlacement } from './type';

export const DropdownMenuRoot: typeof Menu.Root = (props) => <Menu.Root modal={false} {...props} />;
export const DropdownMenuSubmenuRoot = Menu.SubmenuRoot;

type XStyle = Parameters<typeof styleProps>[0];

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => clsx(base, className(state));
  return clsx(base, className);
};

const sx = (styles: XStyle, stableClassName?: string) =>
  clsx(stylex.props(styles).className, stableClassName);

const itemClassName = (danger: boolean | undefined) =>
  sx([menuStyles.item, danger && menuStyles.danger], dropdownMenuClasses('item'));

const withStateClassName =
  <TState,>(
    base: string,
    className: string | ((state: TState) => string | undefined) | undefined,
  ) =>
  (state: TState) =>
    clsx(base, typeof className === 'function' ? className(state) : className);

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
      className: clsx(
        CLASSNAMES.DropdownMenuTrigger,
        dropdownMenuClasses('trigger'),
        className,
        mergedProps.className,
      ),
      ref: mergeRefs([getElementRef(children), (props as any).ref, refProp]),
    });
  };

  if (isValidElement(children)) {
    return <Menu.Trigger {...rest} nativeButton={resolvedNativeButton} render={renderer as any} />;
  }

  return (
    <Menu.Trigger
      {...rest}
      className={clsx(CLASSNAMES.DropdownMenuTrigger, dropdownMenuClasses('trigger'), className)}
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
  const appElement = useAppElement();
  return <Menu.Portal container={container ?? appElement ?? undefined} {...rest} />;
};

DropdownMenuPortal.displayName = 'DropdownMenuPortal';

export type DropdownMenuPositionerProps = React.ComponentProps<typeof Menu.Positioner> & {
  hoverTrigger?: boolean;
  placement?: DropdownMenuPlacement;
};

export const DropdownMenuPositioner = ({
  className,
  collisionPadding,
  placement,
  hoverTrigger,
  align,
  side,
  sideOffset,
  children,
  style,
  ...rest
}: DropdownMenuPositionerProps) => {
  const placementConfig = placement ? placementMap[placement] : undefined;
  const [positionerNode, setPositionerNode] = useState<HTMLDivElement | null>(null);

  const explicitZIndex =
    typeof style !== 'function' && style?.zIndex != null && typeof style.zIndex === 'number'
      ? style.zIndex
      : undefined;
  const { zIndex, ref: zRef } = useLayerZIndex<HTMLDivElement>('floating', explicitZIndex);
  const composedRef = useMergeRefs([setPositionerNode, zRef]);

  const resolvedStyle =
    typeof style === 'function'
      ? (state: any) => ({ zIndex, ...style(state) })
      : { zIndex, ...style };

  return (
    <Menu.Positioner
      {...rest}
      align={align ?? placementConfig?.align}
      collisionPadding={collisionPadding ?? getFloatingCollisionPadding()}
      data-hover-trigger={hoverTrigger || undefined}
      data-placement={placement}
      ref={composedRef as any}
      side={side ?? placementConfig?.side}
      sideOffset={sideOffset ?? (placementConfig ? 6 : undefined)}
      style={resolvedStyle}
      className={
        mergeStateClassName(
          sx(
            menuStyles.positioner,
            clsx(menuClassNames.positioner, dropdownMenuClasses('positioner')),
          ),
          className as any,
        ) as any
      }
    >
      <FloatingLayerProvider value={positionerNode}>{children}</FloatingLayerProvider>
    </Menu.Positioner>
  );
};

DropdownMenuPositioner.displayName = 'DropdownMenuPositioner';

export type DropdownMenuPopupProps = React.ComponentProps<typeof Menu.Popup>;

export const DropdownMenuPopupImpl = ({
  className,
  xstyle,
  ...rest
}: DropdownMenuPopupProps & { xstyle?: XStyle }) => {
  return (
    <Menu.Popup
      {...rest}
      className={
        mergeStateClassName(
          sx([menuStyles.popup, xstyle], clsx(menuClassNames.popup, dropdownMenuClasses())),
          className as any,
        ) as any
      }
    />
  );
};

export const DropdownMenuPopup = (props: DropdownMenuPopupProps) => (
  <DropdownMenuPopupImpl {...props} />
);

DropdownMenuPopup.displayName = 'DropdownMenuPopup';

export type DropdownMenuHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownMenuHeader = ({ className, ...rest }: DropdownMenuHeaderProps) => {
  return (
    <div
      {...rest}
      className={clsx(sx(menuStyles.header, dropdownMenuClasses('header')), className)}
      data-slot="header"
    />
  );
};

DropdownMenuHeader.displayName = 'DropdownMenuHeader';

export type DropdownMenuFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownMenuFooter = ({ className, ...rest }: DropdownMenuFooterProps) => {
  return (
    <div
      {...rest}
      className={clsx(sx(menuStyles.footer, dropdownMenuClasses('footer')), className)}
      data-slot="footer"
    />
  );
};

DropdownMenuFooter.displayName = 'DropdownMenuFooter';

export type DropdownMenuScrollViewportProps = React.HTMLAttributes<HTMLDivElement> &
  VirtualListProps;

export const DropdownMenuScrollViewport = ({
  children,
  className,
  getItemLabel,
  keepMounted,
  listItemHeight,
  virtual,
  ...rest
}: DropdownMenuScrollViewportProps) => {
  if (!virtual) {
    return (
      <div
        {...rest}
        className={clsx(sx(menuStyles.slotViewport, dropdownMenuClasses('viewport')), className)}
      >
        {children}
      </div>
    );
  }

  return (
    <MenuVirtualList
      {...rest}
      className={clsx(dropdownMenuClasses('viewport'), className)}
      getItemLabel={getItemLabel}
      itemSize={listItemHeight}
      keepMounted={keepMounted}
    >
      {children}
    </MenuVirtualList>
  );
};

DropdownMenuScrollViewport.displayName = 'DropdownMenuScrollViewport';

export type DropdownMenuItemProps = React.ComponentProps<typeof Menu.Item> & { danger?: boolean };

export const DropdownMenuItem = ({ className, danger, ...rest }: DropdownMenuItemProps) => {
  return <Menu.Item {...rest} className={withStateClassName(itemClassName(danger), className)} />;
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
    <Menu.CheckboxItem {...rest} className={withStateClassName(itemClassName(danger), className)} />
  );
};

DropdownMenuCheckboxItemPrimitive.displayName = 'DropdownMenuCheckboxItemPrimitive';

export type DropdownMenuSeparatorProps = React.ComponentProps<typeof Menu.Separator>;

export const DropdownMenuSeparator = ({ className, ...rest }: DropdownMenuSeparatorProps) => {
  return (
    <Menu.Separator
      {...rest}
      className={withStateClassName(
        sx(menuStyles.separator, dropdownMenuClasses('separator')),
        className,
      )}
    />
  );
};

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export type DropdownMenuGroupProps = React.ComponentProps<typeof Menu.Group>;

export const DropdownMenuGroup = ({ className, ...rest }: DropdownMenuGroupProps) => (
  <Menu.Group {...rest} className={withStateClassName(dropdownMenuClasses('group'), className)} />
);

DropdownMenuGroup.displayName = 'DropdownMenuGroup';

export type DropdownMenuCheckboxItemIndicatorProps = React.ComponentProps<
  typeof Menu.CheckboxItemIndicator
>;

export const DropdownMenuCheckboxItemIndicator = ({
  className,
  ...rest
}: DropdownMenuCheckboxItemIndicatorProps) => (
  <Menu.CheckboxItemIndicator
    {...rest}
    className={withStateClassName(dropdownMenuClasses('checkbox-indicator'), className)}
  />
);

DropdownMenuCheckboxItemIndicator.displayName = 'DropdownMenuCheckboxItemIndicator';

export type DropdownMenuGroupLabelProps = React.ComponentProps<typeof Menu.GroupLabel>;

export const DropdownMenuGroupLabel = ({ className, ...rest }: DropdownMenuGroupLabelProps) => {
  return (
    <Menu.GroupLabel
      {...rest}
      className={withStateClassName(
        sx(menuStyles.groupLabel, dropdownMenuClasses('group-label')),
        className,
      )}
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
      className={withStateClassName(itemClassName(danger), className)}
    />
  );
};

DropdownMenuSubmenuTrigger.displayName = 'DropdownMenuSubmenuTrigger';

export type DropdownMenuItemContentProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownMenuItemContentImpl = ({
  className,
  xstyle,
  ...rest
}: DropdownMenuItemContentProps & { xstyle?: XStyle }) => {
  return (
    <div
      {...rest}
      className={clsx(
        sx([menuStyles.itemContent, xstyle], dropdownMenuClasses('item-content')),
        className,
      )}
    />
  );
};

export const DropdownMenuItemContent = (props: DropdownMenuItemContentProps) => (
  <DropdownMenuItemContentImpl {...props} />
);

DropdownMenuItemContent.displayName = 'DropdownMenuItemContent';

export type DropdownMenuItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemIconImpl = ({
  className,
  xstyle,
  ...rest
}: DropdownMenuItemIconProps & { xstyle?: XStyle }) => {
  return (
    <span
      {...rest}
      className={clsx(
        sx([menuStyles.icon, xstyle], clsx(menuClassNames.icon, dropdownMenuClasses('icon'))),
        className,
      )}
    />
  );
};

export const DropdownMenuItemIcon = (props: DropdownMenuItemIconProps) => (
  <DropdownMenuItemIconImpl {...props} />
);

DropdownMenuItemIcon.displayName = 'DropdownMenuItemIcon';

export type DropdownMenuItemLabelGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownMenuItemLabelGroup = ({
  className,
  ...rest
}: DropdownMenuItemLabelGroupProps) => {
  return (
    <div
      {...rest}
      className={clsx(sx(menuStyles.labelGroup, dropdownMenuClasses('label-group')), className)}
    />
  );
};

DropdownMenuItemLabelGroup.displayName = 'DropdownMenuItemLabelGroup';

export type DropdownMenuItemLabelProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemLabel = ({ className, ...rest }: DropdownMenuItemLabelProps) => {
  return (
    <span
      {...rest}
      className={clsx(
        sx(menuStyles.label, clsx(menuClassNames.label, dropdownMenuClasses('label'))),
        className,
      )}
    />
  );
};

DropdownMenuItemLabel.displayName = 'DropdownMenuItemLabel';

export type DropdownMenuItemDescProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemDesc = ({ className, ...rest }: DropdownMenuItemDescProps) => {
  return (
    <span {...rest} className={clsx(sx(menuStyles.desc, dropdownMenuClasses('desc')), className)} />
  );
};

DropdownMenuItemDesc.displayName = 'DropdownMenuItemDesc';

export type DropdownMenuItemExtraProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuItemExtra = ({ className, ...rest }: DropdownMenuItemExtraProps) => {
  return (
    <span
      {...rest}
      className={clsx(sx(menuStyles.extra, dropdownMenuClasses('extra')), className)}
    />
  );
};

DropdownMenuItemExtra.displayName = 'DropdownMenuItemExtra';

export type DropdownMenuSubmenuArrowProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuSubmenuArrow = ({ className, ...rest }: DropdownMenuSubmenuArrowProps) => {
  return (
    <span
      {...rest}
      className={clsx(
        sx(
          menuStyles.submenuArrow,
          clsx(menuClassNames.submenuArrow, dropdownMenuClasses('submenu-arrow')),
        ),
        className,
      )}
    />
  );
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
      className={withStateClassName(itemClassName(danger), className)}
      closeOnClick={closeOnClick}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          handleCheckedChange(!checked);
        }
      }}
    >
      {children}
      <span
        className={sx(menuStyles.switchWrap, dropdownMenuClasses('switch'))}
        onFocus={(e) => e.stopPropagation()}
      >
        <Switch
          checked={checked}
          disabled={disabled}
          size="small"
          tabIndex={-1}
          onChange={handleCheckedChange}
          onClick={(_, e) => e.stopPropagation()}
        />
      </span>
    </Menu.Item>
  );
};

DropdownMenuSwitchItem.displayName = 'DropdownMenuSwitchItem';
