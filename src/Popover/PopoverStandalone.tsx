'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Popover as BasePopover } from '@base-ui/react/popover';
import type { Side } from '@base-ui/react/utils/useAnchorPositioning';
import { cx } from 'antd-style';
import { cloneElement, isValidElement, memo, useCallback, useMemo, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useIsClient } from '@/hooks/useIsClient';
import { useNativeButton } from '@/hooks/useNativeButton';
import { placementMap } from '@/utils/placement';

import { PopoverArrowIcon } from './ArrowIcon';
import { usePopoverPortalContainer } from './PopoverPortal';
import { PopoverProvider } from './context';
import { parseTrigger } from './parseTrigger';
import { styles } from './style';
import type { PopoverProps } from './type';

/**
 * Popover component - displays floating content relative to a trigger element
 * Compatible with Ant Design Popover API
 */
export const PopoverStandalone = memo<PopoverProps>(
  ({
    children,
    content,
    arrow: originArrow = false,
    inset = false,
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
    const arrow = inset ? false : originArrow;
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
    const baseSideOffset = arrow ? 10 : 6;
    const resolvedSideOffset = useMemo(() => {
      if (!inset) return baseSideOffset;
      return ({
        side,
        positioner,
      }: {
        positioner: { height: number; width: number };
        side: Side;
      }) => {
        if (
          side === 'left' ||
          side === 'right' ||
          side === 'inline-start' ||
          side === 'inline-end'
        ) {
          return -positioner.width;
        }
        return -positioner.height;
      };
    }, [baseSideOffset, inset]);

    // Determine portal container
    const portalContainer = usePopoverPortalContainer();

    const { isNativeButtonTriggerElement, resolvedNativeButton } = useNativeButton({
      children,
      nativeButton,
    });

    const resolvedClassNames = useMemo(
      () => ({
        arrow: cx(styles.arrow, classNames?.arrow),
        popup: cx(styles.popup, className),
        positioner: cx(styles.positioner, classNames?.root),
        trigger: classNames?.trigger,
        viewport: cx(styles.viewport, classNames?.content),
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

      if (isValidElement(children)) {
        return (
          <BasePopover.Trigger
            handle={popoverHandle}
            {...baseTriggerProps}
            nativeButton={resolvedNativeButton}
            render={(props) => {
              // Base UI's trigger props include `type="button"` by default.
              // If we render into a non-<button> element, that prop is invalid and can warn.
              const resolvedProps = (() => {
                if (isNativeButtonTriggerElement) return props as any;
                // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
                const { type, ref: triggerRef, ...restProps } = props as any;
                return restProps;
              })();

              const mergedProps = mergeProps((children as any).props, resolvedProps);
              return cloneElement(children as any, {
                ...mergedProps,
                className: cx(mergedProps.className, resolvedClassNames.trigger),
                ref: mergeRefs([(children as any).ref, (props as any).ref, refProp]),
              });
            }}
          />
        );
      }
      return (
        <BasePopover.Trigger
          handle={popoverHandle}
          {...baseTriggerProps}
          className={resolvedClassNames.trigger}
          nativeButton={resolvedNativeButton}
          ref={refProp}
        >
          {children}
        </BasePopover.Trigger>
      );
    }, [
      children,
      disabled,
      isNativeButtonTriggerElement,
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
        <BasePopover.Positioner
          align={placementConfig.align}
          className={resolvedClassNames.positioner}
          data-hover-trigger={openOnHover || undefined}
          data-placement={placement}
          side={placementConfig.side}
          sideOffset={resolvedSideOffset}
          style={resolvedStyles.positioner}
          {...positionerProps}
        >
          <BasePopover.Popup className={resolvedClassNames.popup} {...popupProps}>
            {arrow && (
              <BasePopover.Arrow className={resolvedClassNames.arrow} style={resolvedStyles.arrow}>
                {PopoverArrowIcon}
              </BasePopover.Arrow>
            )}
            <BasePopover.Viewport
              className={resolvedClassNames.viewport}
              style={resolvedStyles.viewport}
            >
              <PopoverProvider value={contextValue}>{content}</PopoverProvider>
            </BasePopover.Viewport>
          </BasePopover.Popup>
        </BasePopover.Positioner>
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
      <BasePopover.Root
        defaultOpen={defaultOpen}
        handle={popoverHandle}
        onOpenChange={handleOpenChange}
        open={resolvedOpen}
      >
        {triggerElement}
        {backdropProps && <BasePopover.Backdrop {...backdropProps} />}
        {resolvedPortalContainer ? (
          <BasePopover.Portal container={resolvedPortalContainer} {...portalProps}>
            {popup}
          </BasePopover.Portal>
        ) : null}
      </BasePopover.Root>
    );
  },
);

PopoverStandalone.displayName = 'PopoverStandalone';
