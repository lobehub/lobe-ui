'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import clsx from 'clsx';
import {
  cloneElement,
  type CSSProperties,
  isValidElement,
  memo,
  type Ref,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { useAppElement } from '@/ConfigProvider/AppElementContext';
import { useFloatingLayer } from '@/hooks/useFloatingLayer';
import { useIsClient } from '@/hooks/useIsClient';
import { useNativeButton } from '@/hooks/useNativeButton';
import { getFloatingCollisionPadding } from '@/internal/floating';
import { styleProps } from '@/styles/stylex/props';
import { getElementRef } from '@/utils/getElementRef';
import { mergeRefs } from '@/utils/mergeRefs';
import { placementMap } from '@/utils/placement';

import { styles as a2uiStyles } from './a2uiStyle';
import { TooltipArrowIcon } from './ArrowIcon';
import { tooltipClasses } from './stable';
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
    variant = 'default',
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

    const isA2ui = variant === 'a2ui';

    // The a2ui tooltip opens and closes at once, like the A2UI standard tooltip.
    const resolvedOpenDelay = useMemo(() => {
      if (openDelay !== undefined) return openDelay;
      if (mouseEnterDelay !== undefined) return mouseEnterDelay * 1000;
      return isA2ui ? 0 : DEFAULT_OPEN_DELAY;
    }, [isA2ui, mouseEnterDelay, openDelay]);

    const resolvedCloseDelay = useMemo(() => {
      if (closeDelay !== undefined) return closeDelay;
      if (mouseLeaveDelay !== undefined) return mouseLeaveDelay * 1000;
      return isA2ui ? 0 : DEFAULT_CLOSE_DELAY;
    }, [closeDelay, isA2ui, mouseLeaveDelay]);

    // The a2ui text is 0.75 of the text around the trigger (the official tooltip's wrapper
    // inherits it), which the portal does not inherit.
    const a2uiFontSize = useMemo(() => {
      if (!isA2ui || !resolvedOpen || !triggerNode || typeof window === 'undefined') return;
      const context = triggerNode.parentElement ?? triggerNode;
      return window.getComputedStyle(context).fontSize || undefined;
    }, [isA2ui, resolvedOpen, triggerNode]);

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
        arrow: styleProps(
          styles.arrow,
          clsx(tooltipClasses('arrow'), classNames?.arrow),
          customStyles?.arrow,
        ),
        popup: styleProps(
          [styles.popup, isA2ui && a2uiStyles.popup],
          clsx(tooltipClasses(), className, classNames?.root, classNames?.container),
          {
            ...(a2uiFontSize && { '--lobe-a2ui-tooltip-font-size': a2uiFontSize }),
            ...customStyles?.root,
            ...customStyles?.container,
          } as CSSProperties,
        ),
        positioner: styleProps(
          styles.positioner,
          tooltipClasses('positioner'),
          zIndex === undefined ? undefined : { zIndex },
        ),
        viewport: styleProps(
          [styles.viewport, isA2ui && a2uiStyles.viewport],
          clsx('lobe-tooltip-viewport', tooltipClasses('viewport'), classNames?.content),
          customStyles?.content,
        ),
      };
    }, [
      a2uiFontSize,
      className,
      classNames?.arrow,
      classNames?.container,
      classNames?.content,
      classNames?.root,
      customStylesProp,
      isA2ui,
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
                className: clsx(tooltipClasses('trigger'), mergedProps.className),
                id: shouldPreservePopupTriggerId ? childProps.id : mergedProps.id,
                ref: mergeRefs([
                  getElementRef(children),
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
          className={tooltipClasses('trigger')}
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
          <BaseTooltip.Popup
            data-placement={placement}
            data-variant={isA2ui ? variant : undefined}
            {...slots.popup}
            {...popupProps}
          >
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
