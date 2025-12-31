'use client';

import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { type FC, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { antdPlacementToFloating } from '@/Tooltip/antdPlacementToFloating';

import TooltipFloating from './TooltipFloating';
import TooltipPortal from './TooltipPortal';
import {
  TooltipGroupApiContext,
  type TooltipGroupItem,
  TooltipGroupPropsContext,
  type TooltipGroupSharedProps,
} from './groupContext';
import { isElementHidden, observeElementVisibility } from './utils';

type TooltipGroupProps = TooltipGroupSharedProps & {
  children: ReactNode;
};

const TooltipGroup: FC<TooltipGroupProps> = ({ children, ...sharedProps }) => {
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const [active, setActive] = useState<{
    item: TooltipGroupItem;
    triggerEl: HTMLElement;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const activeRef = useRef<typeof active>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const floatingPlacement = useMemo(
    () => antdPlacementToFloating(active?.item.placement),
    [active?.item.placement],
  );

  const middleware = useMemo(() => {
    const base = [offset(8), flip(), shift({ padding: 8 })];
    if (active?.item.arrow) base.push(arrowMiddleware({ element: arrowRef }));
    return base;
  }, [active?.item.arrow]);

  const { context, floatingStyles, refs } = useFloating({
    middleware,
    open,
    placement: floatingPlacement,
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!active?.triggerEl) return;
    refs.setReference(active.triggerEl);
  }, [active?.triggerEl, refs]);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
  }, []);

  const closeImmediately = useCallback(() => {
    clearTimers();
    setOpen(false);
    activeRef.current?.item.onOpenChange?.(false);
  }, [clearTimers]);

  const destroyActive = useCallback(() => {
    clearTimers();
    setOpen(false);
    activeRef.current?.item.onOpenChange?.(false);
    setActive(null);
  }, [clearTimers]);

  const isActiveTrigger = useCallback((triggerEl: HTMLElement) => {
    return Boolean(activeRef.current && activeRef.current.triggerEl === triggerEl);
  }, []);

  const closeFromTrigger = useCallback(
    (triggerEl: HTMLElement, item: TooltipGroupItem) => {
      if (!activeRef.current || activeRef.current.triggerEl !== triggerEl) return;

      clearTimers();

      const delayMs =
        item.closeDelay ?? (item.mouseLeaveDelay !== undefined ? item.mouseLeaveDelay * 1000 : 100);
      if (delayMs <= 0) {
        setOpen(false);
        item.onOpenChange?.(false);
        return;
      }

      closeTimerRef.current = window.setTimeout(() => {
        setOpen(false);
        item.onOpenChange?.(false);
      }, delayMs);
    },
    [clearTimers],
  );

  const openFromTrigger = useCallback(
    (triggerEl: HTMLElement, item: TooltipGroupItem) => {
      if (!triggerEl) return;
      if (!item.title) return;
      if (item.disabled) return;

      clearTimers();

      if (isElementHidden(triggerEl)) {
        if (isActiveTrigger(triggerEl)) destroyActive();
        return;
      }

      setActive({ item, triggerEl });

      const delayMs =
        item.openDelay ?? (item.mouseEnterDelay !== undefined ? item.mouseEnterDelay * 1000 : 400);
      if (delayMs <= 0) {
        if (isElementHidden(triggerEl)) {
          destroyActive();
          return;
        }
        setOpen(true);
        item.onOpenChange?.(true);
        return;
      }

      openTimerRef.current = window.setTimeout(() => {
        if (isElementHidden(triggerEl)) {
          destroyActive();
          return;
        }
        setOpen(true);
        item.onOpenChange?.(true);
      }, delayMs);
    },
    [clearTimers, destroyActive, isActiveTrigger],
  );

  const groupApi = useMemo(
    () => ({ closeFromTrigger, closeImmediately, isActiveTrigger, openFromTrigger }),
    [closeFromTrigger, closeImmediately, isActiveTrigger, openFromTrigger],
  );

  useEffect(() => {
    if (!open) return;
    const triggerEl = active?.triggerEl;
    if (!triggerEl) return;

    if (isElementHidden(triggerEl)) {
      destroyActive();
      return;
    }

    const stopVisibilityObserver = observeElementVisibility(triggerEl, (visible) => {
      if (!visible) destroyActive();
    });

    const root = triggerEl.getRootNode?.();
    const observeTarget =
      typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot
        ? root
        : (triggerEl.ownerDocument ?? document);

    const observer = new MutationObserver(() => {
      if (isElementHidden(triggerEl)) destroyActive();
    });

    observer.observe(observeTarget, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      stopVisibilityObserver?.();
    };
  }, [active?.triggerEl, destroyActive, open]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const portalRoot =
    active?.item.getPopupContainer && active?.triggerEl
      ? active.item.getPopupContainer(active.triggerEl)
      : undefined;

  const floatingNode = (
    <TooltipFloating
      arrow={active?.item.arrow}
      arrowRef={arrowRef}
      className={active?.item.className}
      classNames={active?.item.classNames}
      context={context}
      floatingStyles={floatingStyles}
      hotkey={active?.item.hotkey}
      hotkeyProps={active?.item.hotkeyProps}
      open={open}
      placement={floatingPlacement}
      setFloating={refs.setFloating}
      styles={active?.item.styles}
      title={active?.item.title}
      zIndex={active?.item.zIndex}
    />
  );

  return (
    <TooltipGroupApiContext.Provider value={groupApi}>
      <TooltipGroupPropsContext.Provider value={sharedProps}>
        {children}
        {active?.item.title &&
          !active.item.disabled &&
          ((active.item.portalled ?? true) ? (
            <TooltipPortal root={portalRoot}>{floatingNode}</TooltipPortal>
          ) : (
            floatingNode
          ))}
      </TooltipGroupPropsContext.Provider>
    </TooltipGroupApiContext.Provider>
  );
};

export default TooltipGroup;
