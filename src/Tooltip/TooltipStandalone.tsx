'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import clsx from 'clsx';
import {
  cloneElement,
  isValidElement,
  memo,
  type Ref,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useAppElement } from '@/ConfigProvider/AppElementContext';
import { useFloatingLayer } from '@/hooks/useFloatingLayer';
import { useIsClient } from '@/hooks/useIsClient';
import { useNativeButton } from '@/hooks/useNativeButton';
import { getFloatingCollisionPadding } from '@/internal/floating';
import { styleProps } from '@/styles/stylex/props';
import { placementMap } from '@/utils/placement';

import { TooltipArrowIcon } from './ArrowIcon';
import { styles } from './style';
import TooltipContent from './TooltipContent';
import { type TooltipProps } from './type';

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
    popupContainer,
    styles: customStylesProp,
    zIndex,
    ref: refProp,
    positionerProps,
    triggerProps,
    popupProps,
    portalProps,
    standalone: _standalone,
    ...restProps
  }) => {
    const isClient = useIsClient();
    const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));
    const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
    const triggerCallbackRef = useCallback((node: HTMLElement | null) => {
      if (node) setTriggerNode(node);
    }, []);

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

    const appElement = useAppElement();
    const floatingLayerContainer = useFloatingLayer();
    const portalContainer = floatingLayerContainer ?? appElement;

    const { isNativeButtonTriggerElement } = useNativeButton({
      children,
    });

    const slots = useMemo(() => {
      const customStyles = typeof customStylesProp === 'function' ? undefined : customStylesProp;
      return {
        arrow: styleProps(styles.arrow, classNames?.arrow, customStyles?.arrow),
        popup: styleProps(styles.popup, clsx(className, classNames?.root, classNames?.container), {
          ...customStyles?.root,
          ...customStyles?.container,
        }),
        positioner: styleProps(styles.positioner, undefined, { zIndex: zIndex ?? 114_514 }),
        viewport: styleProps(
          styles.viewport,
          clsx('lobe-tooltip-viewport', classNames?.content),
          customStyles?.content,
        ),
      };
    }, [
      className,
      classNames?.arrow,
      classNames?.container,
      classNames?.content,
      classNames?.root,
      customStylesProp,
      zIndex,
    ]);

    const triggerElement = useMemo(() => {
      const popupTriggerId =
        isValidElement(children) &&
        (children as any).props['aria-haspopup'] !== undefined &&
        (children as any).props.id !== undefined
          ? (children as any).props.id
          : undefined;

      const baseTriggerProps = {
        closeDelay: resolvedCloseDelay,
        delay: resolvedOpenDelay,
        disabled,
        ...triggerProps,
        id: popupTriggerId ?? triggerProps?.id,
      };

      if (isValidElement(children)) {
        return (
          <BaseTooltip.Trigger
            {...baseTriggerProps}
            render={(props) => {
              // Base UI's trigger props include `type="button"` by default.
              // If we render into a non-<button> element, that prop is invalid and can warn.
              const resolvedProps = (() => {
                if (isNativeButtonTriggerElement) return props as any;
                // eslint-disable-next-line unused-imports/no-unused-vars
                const { type, ref: triggerRef, ...triggerRest } = props as any;
                return triggerRest;
              })();

              const childProps = (children as any).props;
              const mergedProps = mergeProps(restProps, childProps, resolvedProps);
              const shouldPreservePopupTriggerId =
                childProps['aria-haspopup'] !== undefined && childProps.id !== undefined;

              return cloneElement(children as any, {
                ...mergedProps,
                id: shouldPreservePopupTriggerId ? childProps.id : mergedProps.id,
                ref: mergeRefs([
                  (children as any).ref,
                  (props as any).ref,
                  refProp,
                  triggerCallbackRef,
                ]),
              });
            }}
          />
        );
      }

      return (
        <BaseTooltip.Trigger
          {...baseTriggerProps}
          ref={mergeRefs([refProp, triggerCallbackRef]) as Ref<HTMLButtonElement>}
        >
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
      restProps,
      triggerCallbackRef,
      triggerProps,
    ]);

    const customContainer = useMemo(() => {
      if (popupContainer) return popupContainer;
      if (!getPopupContainer || !isClient || !triggerNode) return undefined;
      return getPopupContainer(triggerNode);
    }, [popupContainer, getPopupContainer, isClient, triggerNode]);

    const popup = useMemo(
      () => (
        <BaseTooltip.Positioner
          align={placementConfig.align}
          data-placement={placement}
          side={placementConfig.side}
          sideOffset={baseSideOffset}
          {...slots.positioner}
          {...positionerProps}
          collisionPadding={positionerProps?.collisionPadding ?? getFloatingCollisionPadding()}
        >
          <BaseTooltip.Popup {...slots.popup} {...popupProps}>
            {arrow && <BaseTooltip.Arrow {...slots.arrow}>{TooltipArrowIcon}</BaseTooltip.Arrow>}
            <BaseTooltip.Viewport {...slots.viewport}>
              <TooltipContent hotkey={hotkey} hotkeyProps={hotkeyProps} title={title} />
            </BaseTooltip.Viewport>
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
        slots,
        title,
      ],
    );

    if (title == null && !hotkey) {
      return children;
    }

    const resolvedPortalContainer = customContainer ?? portalContainer;

    return (
      <BaseTooltip.Root
        defaultOpen={defaultOpen}
        disabled={disabled}
        open={resolvedOpen}
        onOpenChange={handleOpenChange}
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
