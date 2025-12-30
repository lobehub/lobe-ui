'use client';

import { type FC, useCallback, useEffect, useState } from 'react';

import TooltipFloating from './TooltipFloating';
import TooltipPortal from './TooltipPortal';
import type { TooltipProps } from './type';
import { useTooltipFloating } from './useTooltipFloating';
import { useTooltipReference } from './useTooltipReference';
import { useTooltipTrigger } from './useTooltipTrigger';

export const TooltipStandalone: FC<TooltipProps> = ({
  ref,
  hotkey,
  className,
  arrow = false,
  title,
  hotkeyProps,
  children,
  placement = 'top',
  openDelay,
  closeDelay,
  mouseEnterDelay,
  mouseLeaveDelay,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  classNames,
  styles: styleProps,
  zIndex,
  portalled = true,
  getPopupContainer,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

  const mergedOpen = open ?? uncontrolledOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );

  const trigger = useTooltipTrigger(children);

  // We need to initialize floating first to get getReferenceProps
  // But we'll use a temporary mergedOpen, then update to connectedOpen
  const floatingHookResult = useTooltipFloating({
    arrow,
    closeDelay,
    disabled,
    mouseEnterDelay,
    mouseLeaveDelay,
    onOpenChange: setOpen,
    open: mergedOpen,
    openDelay,
    placement,
  });

  const { referenceConnected, referenceEl, referenceNode } = useTooltipReference({
    getReferenceProps: floatingHookResult.getReferenceProps,
    mergedOpen,
    ref,
    setOpen,
    setReference: floatingHookResult.refs.setReference,
    trigger,
  });

  const connectedOpen = !disabled && mergedOpen && referenceConnected;

  // Use the first hook result
  // Note: useFloating inside uses mergedOpen, but TooltipFloating component uses connectedOpen for display
  const { arrowRef, context, floatingPlacement, floatingStyles, getFloatingProps, refs } =
    floatingHookResult;

  // Watch for trigger removal via MutationObserver
  useEffect(() => {
    if (!mergedOpen) return;
    if (!referenceEl || !referenceEl.isConnected) {
      setOpen(false);
      return;
    }

    const root = referenceEl.getRootNode?.();
    const observeTarget =
      typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot
        ? root
        : (referenceEl.ownerDocument ?? document);

    const observer = new MutationObserver(() => {
      if (!referenceEl.isConnected) setOpen(false);
    });

    observer.observe(observeTarget, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [mergedOpen, referenceEl, setOpen]);

  const portalRoot =
    getPopupContainer && referenceEl && referenceConnected
      ? getPopupContainer(referenceEl as any)
      : undefined;

  const floatingNode = (
    <TooltipFloating
      arrow={arrow}
      arrowRef={arrowRef}
      className={className}
      classNames={classNames}
      context={context}
      floatingProps={getFloatingProps()}
      floatingStyles={floatingStyles}
      hotkey={hotkey}
      hotkeyProps={hotkeyProps}
      open={connectedOpen}
      placement={floatingPlacement}
      setFloating={refs.setFloating}
      styles={styleProps}
      title={title}
      zIndex={zIndex}
    />
  );

  return (
    <>
      {referenceNode}
      {!disabled &&
        title &&
        (portalled ? (
          <TooltipPortal root={portalRoot}>{floatingNode}</TooltipPortal>
        ) : (
          floatingNode
        ))}
    </>
  );
};

TooltipStandalone.displayName = 'TooltipStandalone';
