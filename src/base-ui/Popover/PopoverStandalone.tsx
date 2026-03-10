'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { memo, useCallback, useMemo, useState } from 'react';

import { useIsClient } from '@/hooks/useIsClient';
import { useNativeButton } from '@/hooks/useNativeButton';
import { parseTrigger } from '@/utils/parseTrigger';
import { placementMap } from '@/utils/placement';

import { PopoverArrowIcon } from './ArrowIcon';
import {
  PopoverArrow,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
  PopoverViewport,
} from './atoms';
import { PopoverProvider } from './context';
import { usePopoverPortalContainer } from './PopoverPortal';
import { type PopoverProps } from './type';

/**
 * Popover component - displays floating content relative to a trigger element
 * Compatible with Ant Design Popover API
 */
export const PopoverStandalone = memo<PopoverProps>(
  ({
    children,
    content,
    arrow = false,
    trigger = 'hover',
    placement = 'top',
    styles: styleProps,
    classNames,
    className,
    open,
    onOpenChange,
    defaultOpen = false,
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    openDelay,
    closeDelay,
    getPopupContainer,
    disabled = false,
    zIndex,
    nativeButton,
    ref: refProp,
    positionerProps,
    triggerProps,
    popupProps,
    backdropProps,
    portalProps,
  }) => {
    const isClient = useIsClient();
    const popoverHandle = useMemo(() => BasePopover.createHandle(), []);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));
    const close = useCallback(() => {
      popoverHandle.close();
    }, [popoverHandle]);
    const contextValue = useMemo(() => ({ close }), [close]);

    const mergedOpen = open ?? uncontrolledOpen;
    const resolvedOpen = disabled ? false : mergedOpen;

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        // Don't open if disabled
        if (disabled && nextOpen) return;

        onOpenChange?.(nextOpen);
        if (open === undefined) {
          setUncontrolledOpen(nextOpen);
        }
      },
      [onOpenChange, open, disabled],
    );

    // Parse trigger mode
    const { openOnHover } = useMemo(() => parseTrigger(trigger), [trigger]);

    // Calculate delays (milliseconds take precedence over seconds)
    const resolvedOpenDelay = openDelay ?? mouseEnterDelay * 1000;
    const resolvedCloseDelay = closeDelay ?? mouseLeaveDelay * 1000;

    // Get placement configuration
    const placementConfig = placementMap[placement] ?? placementMap.top;
    const resolvedSideOffset = arrow ? 10 : 6;

    // Determine portal container
    const portalContainer = usePopoverPortalContainer();

    const { resolvedNativeButton } = useNativeButton({
      children,
      nativeButton,
    });

    const resolvedClassNames = useMemo(
      () => ({
        arrow: classNames?.arrow,
        popup: className,
        positioner: classNames?.root,
        trigger: classNames?.trigger,
        viewport: classNames?.content,
      }),
      [className, classNames?.arrow, classNames?.content, classNames?.root, classNames?.trigger],
    );

    // Render trigger element
    const triggerElement = useMemo(() => {
      const baseTriggerProps = {
        closeDelay: resolvedCloseDelay,
        delay: resolvedOpenDelay,
        disabled,
        openOnHover: openOnHover && !disabled,
        ...triggerProps,
      };

      return (
        <PopoverTriggerElement
          handle={popoverHandle}
          {...baseTriggerProps}
          className={resolvedClassNames.trigger}
          nativeButton={resolvedNativeButton}
          ref={refProp as any}
        >
          {children}
        </PopoverTriggerElement>
      );
    }, [
      children,
      disabled,
      openOnHover,
      popoverHandle,
      refProp,
      resolvedClassNames.trigger,
      resolvedNativeButton,
      resolvedOpenDelay,
      resolvedCloseDelay,
      triggerProps,
    ]);

    // Custom container from getPopupContainer
    const customContainer = useMemo(() => {
      if (!getPopupContainer || !isClient) return undefined;
      // We need a reference element, but we don't have it until render
      // This will be handled by the portal container logic
      return undefined;
    }, [getPopupContainer, isClient]);

    const resolvedStyles = useMemo(
      () => ({
        arrow: styleProps?.arrow,
        positioner: {
          ...styleProps?.root,
          zIndex: zIndex ?? 1100,
        },
        viewport: styleProps?.content,
      }),
      [styleProps?.arrow, styleProps?.content, styleProps?.root, zIndex],
    );

    const popup = useMemo(
      () => (
        <PopoverPositioner
          align={placementConfig.align}
          className={resolvedClassNames.positioner}
          hoverTrigger={openOnHover}
          placement={placement}
          side={placementConfig.side}
          sideOffset={resolvedSideOffset}
          style={resolvedStyles.positioner}
          {...positionerProps}
        >
          <PopoverPopup className={resolvedClassNames.popup} {...popupProps}>
            {arrow && (
              <PopoverArrow className={resolvedClassNames.arrow} style={resolvedStyles.arrow}>
                {PopoverArrowIcon}
              </PopoverArrow>
            )}
            <PopoverViewport
              className={resolvedClassNames.viewport}
              style={resolvedStyles.viewport}
            >
              <PopoverProvider value={contextValue}>{content}</PopoverProvider>
            </PopoverViewport>
          </PopoverPopup>
        </PopoverPositioner>
      ),
      [
        arrow,
        content,
        contextValue,
        openOnHover,
        placement,
        placementConfig.align,
        placementConfig.side,
        popupProps,
        positionerProps,
        resolvedClassNames,
        resolvedSideOffset,
        resolvedStyles,
      ],
    );

    // Don't render popup if no content
    if (!content) {
      return children;
    }

    const resolvedPortalContainer = customContainer ?? portalContainer;

    return (
      <PopoverRoot
        defaultOpen={defaultOpen}
        handle={popoverHandle}
        open={resolvedOpen}
        onOpenChange={handleOpenChange}
      >
        {triggerElement}
        {backdropProps && <BasePopover.Backdrop {...backdropProps} />}
        {resolvedPortalContainer ? (
          <PopoverPortal container={resolvedPortalContainer} {...portalProps}>
            {popup}
          </PopoverPortal>
        ) : null}
      </PopoverRoot>
    );
  },
);

PopoverStandalone.displayName = 'PopoverStandalone';
