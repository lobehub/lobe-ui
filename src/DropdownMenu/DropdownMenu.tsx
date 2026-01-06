'use client';

import { Menu, type MenuTriggerState } from '@base-ui/react/menu';
import { mergeProps } from '@base-ui/react/merge-props';
import type { ComponentRenderFn, HTMLProps } from '@base-ui/react/utils/types';
import { cx } from 'antd-style';
import clsx from 'clsx';
import {
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { styles } from '@/Menu/sharedStyle';
import { useNativeButton } from '@/hooks/useNativeButton';
import { usePortalContainer } from '@/hooks/usePortalContainer';
import { CLASSNAMES } from '@/styles/classNames';
import { placementMap } from '@/utils/placement';

import { renderDropdownMenuItems } from './renderItems';
import type { DropdownMenuProps } from './type';

const DROPDOWN_MENU_CONTAINER_ATTR = 'data-lobe-ui-dropdown-menu-container';

const DropdownMenu = memo<DropdownMenuProps>(
  ({
    children,
    defaultOpen,

    items,
    nativeButton,
    onOpenChange,
    onOpenChangeComplete,
    open,
    placement = 'bottomLeft',
    popupProps,
    portalProps,
    positionerProps,
    triggerProps,
    ...rest
  }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

    useEffect(() => {
      if (open === undefined) return;
      setUncontrolledOpen(open);
    }, [open]);

    const handleOpenChange = useCallback(
      (nextOpen: boolean, details: Parameters<NonNullable<typeof onOpenChange>>[1]) => {
        onOpenChange?.(nextOpen, details);
        if (open === undefined) {
          setUncontrolledOpen(nextOpen);
        }
      },
      [onOpenChange, open],
    );

    const menuItemsRef = useRef<ReturnType<typeof renderDropdownMenuItems> | null>(null);
    const isOpen = open ?? uncontrolledOpen;
    const menuItems = useMemo(() => {
      if (isOpen) {
        const resolvedItems = typeof items === 'function' ? items() : items;
        const renderedItems = renderDropdownMenuItems(resolvedItems);
        menuItemsRef.current = renderedItems;
        return renderedItems;
      }
      return menuItemsRef.current;
    }, [isOpen, items]);
    const handleOpenChangeComplete = useCallback(
      (nextOpen: boolean) => {
        onOpenChangeComplete?.(nextOpen);
        if (!nextOpen) {
          menuItemsRef.current = null;
        }
      },
      [onOpenChangeComplete],
    );
    const portalContainer = usePortalContainer(DROPDOWN_MENU_CONTAINER_ATTR);
    const placementConfig = placementMap[placement];
    const hoverTrigger = Boolean((triggerProps as any)?.openOnHover);

    const { isNativeButtonTriggerElement, resolvedNativeButton } = useNativeButton({
      children,
      nativeButton,
      triggerNativeButton: triggerProps?.nativeButton,
    });

    const renderer: ComponentRenderFn<HTMLProps<any>, MenuTriggerState> = useCallback(
      (props) => {
        // Base UI's trigger props include `type="button"` by default.
        // If we render into a non-<button> element, that prop is invalid and can warn.
        const resolvedProps = (() => {
          if (isNativeButtonTriggerElement) return props as any;
          // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
          const { type, ...restProps } = props as any;
          return restProps;
        })();

        return cloneElement(children as any, mergeProps((children as any).props, resolvedProps));
      },
      [children, isNativeButtonTriggerElement],
    );

    const trigger = isValidElement(children) ? (
      <Menu.Trigger
        {...triggerProps}
        className={clsx(CLASSNAMES.DropdownMenuTrigger, triggerProps?.className)}
        nativeButton={resolvedNativeButton}
        render={renderer}
      />
    ) : (
      <Menu.Trigger
        {...triggerProps}
        className={clsx(CLASSNAMES.DropdownMenuTrigger, triggerProps?.className)}
      >
        {children}
      </Menu.Trigger>
    );

    const resolvedPositionerProps = {
      ...positionerProps,
      align: positionerProps?.align ?? placementConfig?.align ?? 'center',
      side: positionerProps?.side ?? placementConfig?.side ?? 'bottom',
      sideOffset: positionerProps?.sideOffset ?? 6,
    };
    return (
      <Menu.Root
        {...rest}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={handleOpenChangeComplete}
        open={open}
      >
        {trigger}
        <Menu.Portal container={portalProps?.container ?? portalContainer} {...portalProps}>
          <Menu.Positioner
            {...resolvedPositionerProps}
            className={(state) =>
              cx(
                styles.positioner,
                typeof positionerProps?.className === 'function'
                  ? positionerProps.className(state)
                  : positionerProps?.className,
              )
            }
            data-hover-trigger={hoverTrigger || undefined}
            data-placement={placement}
          >
            <Menu.Popup
              {...popupProps}
              className={(state) =>
                cx(
                  styles.popup,
                  typeof popupProps?.className === 'function'
                    ? popupProps.className(state)
                    : popupProps?.className,
                )
              }
            >
              {menuItems}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenuV2';

export default DropdownMenu;
