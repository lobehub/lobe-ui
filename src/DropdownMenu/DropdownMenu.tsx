'use client';

import { Menu } from '@base-ui/react/menu';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNativeButton } from '@/hooks/useNativeButton';
import { parseTrigger } from '@/utils/parseTrigger';

import {
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
} from './atoms';
import { renderDropdownMenuItems } from './renderItems';
import type { DropdownMenuProps } from './type';

const DropdownMenu = memo<DropdownMenuProps>(
  ({
    children,
    defaultOpen,
    iconAlign,
    iconSpaceMode,
    items,
    nativeButton,
    onOpenChange,
    onOpenChangeComplete,
    open,
    placement = 'bottomLeft',
    popupProps,
    portalProps,
    positionerProps,
    trigger = 'click',
    triggerProps,
    ...rest
  }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

    const { openOnHover } = useMemo(() => parseTrigger(trigger), [trigger]);

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
        const renderedItems = renderDropdownMenuItems(resolvedItems, [], {
          iconAlign,
          iconSpaceMode,
        });
        menuItemsRef.current = renderedItems;
        return renderedItems;
      }
      return menuItemsRef.current;
    }, [isOpen, items, iconAlign, iconSpaceMode]);
    const handleOpenChangeComplete = useCallback(
      (nextOpen: boolean) => {
        onOpenChangeComplete?.(nextOpen);
        if (!nextOpen) {
          menuItemsRef.current = null;
        }
      },
      [onOpenChangeComplete],
    );
    const { container: portalContainer, ...restPortalProps } = (portalProps ?? {}) as any;

    const { resolvedNativeButton } = useNativeButton({
      children,
      nativeButton,
      triggerNativeButton: triggerProps?.nativeButton,
    });

    const triggerElement = (
      <DropdownMenuTrigger
        {...triggerProps}
        nativeButton={resolvedNativeButton}
        openOnHover={openOnHover}
      >
        {children}
      </DropdownMenuTrigger>
    );

    return (
      <Menu.Root
        {...rest}
        defaultOpen={defaultOpen}
        modal={false}
        open={open}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={handleOpenChangeComplete}
      >
        {triggerElement}
        <DropdownMenuPortal container={portalContainer} {...restPortalProps}>
          <DropdownMenuPositioner
            {...positionerProps}
            hoverTrigger={openOnHover}
            placement={placement}
          >
            <DropdownMenuPopup {...popupProps}>{menuItems}</DropdownMenuPopup>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </Menu.Root>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenuV2';

export default DropdownMenu;
