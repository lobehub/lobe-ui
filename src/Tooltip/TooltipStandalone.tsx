'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from 'antd-style';
import { cloneElement, isValidElement, memo, useCallback, useMemo, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useFloatingLayer } from '@/hooks/useFloatingLayer';
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
    arrow = false,
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
    styles: styleProps,
    zIndex,
    ref: refProp,
    positionerProps,
    triggerProps,
    popupProps,
    portalProps,
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

    const defaultPortalContainer = useTooltipPortalContainer();
    const floatingLayerContainer = useFloatingLayer();
    const portalContainer = floatingLayerContainer ?? defaultPortalContainer;

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
          zIndex: zIndex ?? 114_514,
        },
        viewport: resolvedStyleProps?.content,
      }),
      [resolvedStyleProps, zIndex],
    );

    const triggerElement = useMemo(() => {
      const baseTriggerProps = {
        closeDelay: resolvedCloseDelay,
        delay: resolvedOpenDelay,
        disabled,
        ...triggerProps,
      };

      if (isValidElement(children)) {
        const isNativeElement = typeof children.type === 'string';
        const isClassComponent =
          typeof children.type === 'function' &&
          Boolean((children.type as any).prototype?.isReactComponent);
        const isForwardRefComponent =
          typeof children.type === 'object' &&
          children.type !== null &&
          ((children.type as any).$$typeof === Symbol.for('react.forward_ref') ||
            ((children.type as any).$$typeof === Symbol.for('react.memo') &&
              (children.type as any).type?.$$typeof === Symbol.for('react.forward_ref')));
        const shouldWrapTrigger = !isNativeElement && !isClassComponent && !isForwardRefComponent;

        return (
          <BaseTooltip.Trigger
            {...baseTriggerProps}
            render={(props) => {
              // Base UI's trigger props include `type="button"` by default.
              // If we render into a non-<button> element, that prop is invalid and can warn.
              const resolvedProps = (() => {
                if (isNativeButtonTriggerElement) return props as any;
                // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
                const { type, ref: triggerRef, ...restProps } = props as any;
                return restProps;
              })();

              if (!shouldWrapTrigger) {
                const mergedProps = mergeProps((children as any).props, resolvedProps);
                return cloneElement(children as any, {
                  ...mergedProps,
                  ref: mergeRefs([(children as any).ref, (props as any).ref, refProp]),
                });
              }

              const { style: triggerStyle, ...restProps } = resolvedProps as any;
              return (
                <span
                  {...restProps}
                  ref={mergeRefs([(props as any).ref, refProp])}
                  style={{ display: 'inline-flex', ...triggerStyle }}
                >
                  {children}
                </span>
              );
            }}
          />
        );
      }

      return (
        <BaseTooltip.Trigger {...baseTriggerProps} ref={refProp}>
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
      triggerProps,
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
          {...positionerProps}
        >
          <BaseTooltip.Popup
            className={resolvedClassNames.popup}
            style={resolvedStyles.popup}
            {...popupProps}
          >
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
        popupProps,
        positionerProps,
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
        {resolvedPortalContainer ? (
          <BaseTooltip.Portal container={resolvedPortalContainer} {...portalProps}>
            {popup}
          </BaseTooltip.Portal>
        ) : null}
      </BaseTooltip.Root>
    );
  },
);

TooltipStandalone.displayName = 'TooltipStandalone';
