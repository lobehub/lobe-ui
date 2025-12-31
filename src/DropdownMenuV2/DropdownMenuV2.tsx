'use client';

import { Menu } from '@base-ui/react/menu';
import { mergeProps } from '@base-ui/react/merge-props';
import { cx } from 'antd-style';
import {
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { styles } from '@/Menu/sharedStyle';
import { LOBE_THEME_APP_ID } from '@/ThemeProvider';
import { TOOLTIP_CONTAINER_ATTR } from '@/Tooltip/TooltipPortal';
import { useIsClient } from '@/hooks/useIsClient';

import { renderDropdownMenuItems } from './renderItems';
import type { DropdownMenuV2Placement, DropdownMenuV2Props } from './type';

const placementMap: Record<
  DropdownMenuV2Placement,
  { align: 'start' | 'center' | 'end'; side: 'top' | 'bottom' }
> = {
  bottomCenter: { align: 'center', side: 'bottom' },
  bottomLeft: { align: 'start', side: 'bottom' },
  bottomRight: { align: 'end', side: 'bottom' },
  topCenter: { align: 'center', side: 'top' },
  topLeft: { align: 'start', side: 'top' },
  topRight: { align: 'end', side: 'top' },
};

const DropdownMenuV2 = memo<DropdownMenuV2Props>(
  ({
    children,
    defaultOpen,

    items,
    onOpenChange,
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

    const shouldRenderItems = open ?? uncontrolledOpen;
    const menuItems = useMemo(() => {
      if (!shouldRenderItems) return null;
      const resolvedItems = typeof items === 'function' ? items() : items;
      return renderDropdownMenuItems(resolvedItems);
    }, [items, shouldRenderItems]);
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
    const trigger = isValidElement(children) ? (
      <Menu.Trigger
        {...triggerProps}
        render={(props) => cloneElement(children, mergeProps(children.props as any, props))}
      />
    ) : (
      <Menu.Trigger {...triggerProps}>{children}</Menu.Trigger>
    );

    return (
      <Menu.Root {...rest} defaultOpen={defaultOpen} onOpenChange={handleOpenChange} open={open}>
        {trigger}
        <Menu.Portal container={portalProps?.container ?? portalContainer} {...portalProps}>
          <Menu.Positioner
            {...positionerProps}
            align={positionerProps?.align ?? placementConfig.align}
            className={(state) =>
              cx(
                styles.positioner,
                typeof positionerProps?.className === 'function'
                  ? positionerProps.className(state)
                  : positionerProps?.className,
              )
            }
            side={positionerProps?.side ?? placementConfig.side}
            sideOffset={positionerProps?.sideOffset ?? 6}
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

DropdownMenuV2.displayName = 'DropdownMenuV2';

export default DropdownMenuV2;
