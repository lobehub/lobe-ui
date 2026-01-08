'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from 'antd-style';
import { cloneElement, isValidElement, memo, useCallback, useMemo, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useIsClient } from '@/hooks/useIsClient';
import { useNativeButton } from '@/hooks/useNativeButton';
import { placementMap } from '@/utils/placement';

import { TooltipArrowIcon } from './ArrowIcon';
import TooltipContent from './TooltipContent';
import { useTooltipPortalContainer } from './TooltipPortal';
import { styles } from './style';
import type { TooltipProps } from './type';

const DEFAULT_OPEN_DELAY = 400;
const DEFAULT_CLOSE_DELAY = 100;

/**
 * Tooltip component - displays small contextual hints on hover/focus
 * Compatible with Ant Design Tooltip-like API (subset)
 */
export const TooltipStandalone = memo<TooltipProps>(
  ({
    children,
    title,
    arrow = true,
    className,
    classNames,
    closeDelay,
    defaultOpen = false,
    disabled = false,
    getPopupContainer,
    hotkey,
    hotkeyProps,
    mouseEnterDelay,
    mouseLeaveDelay,
    onOpenChange,
    open,
    openDelay,
    placement = 'top',
    portalled = true,
    styles: styleProps,
    zIndex,
    ref: refProp,
  }) => {
    const isClient = useIsClient();
    const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

    const mergedOpen = open ?? uncontrolledOpen;
    const resolvedOpen = disabled ? false : mergedOpen;

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        if (disabled && nextOpen) return;
        onOpenChange?.(nextOpen);
        if (open === undefined) {
          setUncontrolledOpen(nextOpen);
        }
      },
      [disabled, onOpenChange, open],
    );

    const resolvedOpenDelay = useMemo(() => {
      if (openDelay !== undefined) return openDelay;
      if (mouseEnterDelay !== undefined) return mouseEnterDelay * 1000;
      return DEFAULT_OPEN_DELAY;
    }, [mouseEnterDelay, openDelay]);

    const resolvedCloseDelay = useMemo(() => {
      if (closeDelay !== undefined) return closeDelay;
      if (mouseLeaveDelay !== undefined) return mouseLeaveDelay * 1000;
      return DEFAULT_CLOSE_DELAY;
    }, [closeDelay, mouseLeaveDelay]);

    const placementConfig = placementMap[placement] ?? placementMap.top;
    const baseSideOffset = arrow ? 8 : 6;

    const portalContainer = useTooltipPortalContainer();

    const { isNativeButtonTriggerElement } = useNativeButton({
      children,
    });

    const resolvedClassNames = useMemo(
      () => ({
        arrow: cx(styles.arrow, classNames?.arrow),
        popup: cx(styles.popup, className, classNames?.root, classNames?.container),
        positioner: styles.positioner,
        viewport: cx(styles.viewport, classNames?.content),
      }),
      [className, classNames?.arrow, classNames?.container, classNames?.content, classNames?.root],
    );

    const resolvedStyleProps = useMemo(() => {
      if (typeof styleProps === 'function') return undefined;
      return styleProps;
    }, [styleProps]);

    const resolvedStyles = useMemo(
      () => ({
        arrow: resolvedStyleProps?.arrow,
        popup: {
          ...resolvedStyleProps?.root,
          ...resolvedStyleProps?.container,
        },
        positioner: {
          zIndex: zIndex ?? 1100,
        },
        viewport: resolvedStyleProps?.content,
      }),
      [resolvedStyleProps, zIndex],
    );

    const triggerElement = useMemo(() => {
      const triggerProps = {
        closeDelay: resolvedCloseDelay,
        delay: resolvedOpenDelay,
        disabled,
      };

      if (isValidElement(children)) {
        return (
          <BaseTooltip.Trigger
            {...triggerProps}
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
                ref: mergeRefs([(children as any).ref, (props as any).ref, refProp]),
              });
            }}
          />
        );
      }

      return (
        <BaseTooltip.Trigger {...triggerProps} ref={refProp}>
          {children}
        </BaseTooltip.Trigger>
      );
    }, [
      children,
      disabled,
      isNativeButtonTriggerElement,
      refProp,
      resolvedCloseDelay,
      resolvedOpenDelay,
    ]);

    const customContainer = useMemo(() => {
      if (!getPopupContainer || !isClient) return undefined;
      return undefined;
    }, [getPopupContainer, isClient]);

    const popup = useMemo(
      () => (
        <BaseTooltip.Positioner
          align={placementConfig.align}
          className={resolvedClassNames.positioner}
          data-placement={placement}
          side={placementConfig.side}
          sideOffset={baseSideOffset}
          style={resolvedStyles.positioner}
        >
          <BaseTooltip.Popup className={resolvedClassNames.popup} style={resolvedStyles.popup}>
            {arrow && (
              <BaseTooltip.Arrow className={resolvedClassNames.arrow} style={resolvedStyles.arrow}>
                {TooltipArrowIcon}
              </BaseTooltip.Arrow>
            )}
            <div className={resolvedClassNames.viewport} style={resolvedStyles.viewport}>
              <TooltipContent hotkey={hotkey} hotkeyProps={hotkeyProps} title={title} />
            </div>
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      ),
      [
        arrow,
        baseSideOffset,
        hotkey,
        hotkeyProps,
        placement,
        placementConfig.align,
        placementConfig.side,
        resolvedClassNames,
        resolvedStyles,
        title,
      ],
    );

    // eslint-disable-next-line eqeqeq
    if (title == null && !hotkey) {
      return children;
    }

    const resolvedPortalContainer = customContainer ?? portalContainer;

    return (
      <BaseTooltip.Root
        defaultOpen={defaultOpen}
        disabled={disabled}
        onOpenChange={handleOpenChange}
        open={resolvedOpen}
      >
        {triggerElement}
        {portalled ? (
          resolvedPortalContainer ? (
            <BaseTooltip.Portal container={resolvedPortalContainer}>{popup}</BaseTooltip.Portal>
          ) : null
        ) : (
          popup
        )}
      </BaseTooltip.Root>
    );
  },
);

TooltipStandalone.displayName = 'TooltipStandalone';
