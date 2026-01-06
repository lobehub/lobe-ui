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
import { LOBE_THEME_APP_ID } from '@/ThemeProvider';
import { TOOLTIP_CONTAINER_ATTR } from '@/Tooltip/TooltipPortal';
import { useIsClient } from '@/hooks/useIsClient';
import { CLASSNAMES } from '@/styles/classNames';
import { placementMap } from '@/utils/placement';

import { renderDropdownMenuItems } from './renderItems';
import type { DropdownMenuProps } from './type';

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
    const isClient = useIsClient();
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
    const portalContainer = useMemo(() => {
      if (!isClient) return null;

      const themeApp = document.querySelector<HTMLElement>(`#${LOBE_THEME_APP_ID}`);
      if (themeApp) return themeApp;

      const tooltipContainer = document.querySelector<HTMLElement>(
        `[${TOOLTIP_CONTAINER_ATTR}="true"]`,
      );
      if (tooltipContainer) return tooltipContainer;

      return document.body;
    }, [isClient]);
    const placementConfig = placementMap[placement];
    const hoverTrigger = Boolean((triggerProps as any)?.openOnHover);

    const isNativeButtonTriggerElement = useMemo(() => {
      if (!isValidElement(children)) return false;
      return typeof children.type === 'string' && children.type === 'button';
    }, [children]);

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

    // When we use `render`, Base UI expects the rendered element to be a native <button> by default.
    // If we can infer it's not, opt out to avoid warnings (users can still override via `nativeButton`).
    const resolvedNativeButton = useMemo(() => {
      if (nativeButton !== undefined) return nativeButton;
      if (triggerProps?.nativeButton !== undefined) return triggerProps.nativeButton;
      if (isNativeButtonTriggerElement) return true;
      if (!isValidElement(children)) return undefined;
      if (typeof children.type === 'string') return false;
      return undefined;
    }, [children, isNativeButtonTriggerElement, nativeButton, triggerProps?.nativeButton]);

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
