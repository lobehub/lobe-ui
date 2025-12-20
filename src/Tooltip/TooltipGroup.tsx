'use client';

import {
  FloatingArrow,
  FloatingPortal,
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { type ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import Hotkey from '@/Hotkey';
import { antdPlacementToFloating } from '@/Tooltip/antdPlacementToFloating';
import { AnimatePresence, LazyMotion, m } from '@/motion';

import { TooltipGroupContext, type TooltipGroupItem } from './groupContext';
import { useStyles } from './style';

type TooltipGroupProps = {
  children: ReactNode;
};

const TooltipGroup = memo<TooltipGroupProps>(({ children }) => {
  const { styles, cx } = useStyles();
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

  const transformOrigin = useMemo(() => {
    const basePlacement = String(floatingPlacement).split('-')[0];
    switch (basePlacement) {
      case 'top': {
        return 'bottom center';
      }
      case 'bottom': {
        return 'top center';
      }
      case 'left': {
        return 'center right';
      }
      case 'right': {
        return 'center left';
      }
      default: {
        return 'center';
      }
    }
  }, [floatingPlacement]);

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

  const isActiveTrigger = useCallback((triggerEl: HTMLElement) => {
    return Boolean(activeRef.current && activeRef.current.triggerEl === triggerEl);
  }, []);

  const closeFromTrigger = useCallback(
    (triggerEl: HTMLElement, item: TooltipGroupItem) => {
      if (!activeRef.current || activeRef.current.triggerEl !== triggerEl) return;

      clearTimers();

      const delayMs = item.closeDelay ?? (item.mouseLeaveDelay ?? 0) * 1000;
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
      setActive({ item, triggerEl });

      const delayMs = item.openDelay ?? (item.mouseEnterDelay ?? 0) * 1000;
      if (delayMs <= 0) {
        setOpen(true);
        item.onOpenChange?.(true);
        return;
      }

      openTimerRef.current = window.setTimeout(() => {
        setOpen(true);
        item.onOpenChange?.(true);
      }, delayMs);
    },
    [clearTimers],
  );

  const api = useMemo(
    () => ({ closeFromTrigger, closeImmediately, isActiveTrigger, openFromTrigger }),
    [closeFromTrigger, closeImmediately, isActiveTrigger, openFromTrigger],
  );

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
    <LazyMotion>
      <AnimatePresence>
        {open && active?.item.title && (
          <m.div
            animate={{ opacity: 1 }}
            className={cx(
              styles.tooltip,
              active.item.classNames?.container,
              active.item.classNames?.root,
              active.item.className,
            )}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="tooltip"
            ref={refs.setFloating}
            role="tooltip"
            style={
              active.item.styles?.root
                ? {
                    ...floatingStyles,
                    zIndex: active.item.zIndex,
                    ...active.item.styles.container,
                    ...active.item.styles.root,
                  }
                : {
                    ...floatingStyles,
                    zIndex: active.item.zIndex,
                    ...active.item.styles?.container,
                  }
            }
            transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
          >
            <m.div
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              initial={{ scale: 0.96 }}
              style={{ transformOrigin }}
              transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className={cx(styles.content, active.item.classNames?.content)}
                style={active.item.styles?.content}
              >
                {active.item.hotkey ? (
                  <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
                    <span>{active.item.title}</span>
                    <Hotkey inverseTheme keys={active.item.hotkey} {...active.item.hotkeyProps} />
                  </Flexbox>
                ) : (
                  active.item.title
                )}
              </div>
              {active.item.arrow && (
                <FloatingArrow
                  className={cx(styles.arrow, active.item.classNames?.arrow)}
                  context={context}
                  height={6}
                  ref={arrowRef}
                  style={active.item.styles?.arrow}
                  width={12}
                />
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );

  return (
    <TooltipGroupContext.Provider value={api}>
      {children}
      {active?.item.title &&
        !active.item.disabled &&
        ((active.item.portalled ?? true) ? (
          <FloatingPortal root={portalRoot}>{floatingNode}</FloatingPortal>
        ) : (
          floatingNode
        ))}
    </TooltipGroupContext.Provider>
  );
});

TooltipGroup.displayName = 'TooltipGroup';

export default TooltipGroup;
