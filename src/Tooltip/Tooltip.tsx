'use client';

import {
  FloatingArrow,
  FloatingPortal,
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import {
  type FC,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Flexbox } from 'react-layout-kit';
import { mergeRefs } from 'react-merge-refs';

import Hotkey from '@/Hotkey';
import { antdPlacementToFloating } from '@/Tooltip/antdPlacementToFloating';
import { AnimatePresence, LazyMotion, m } from '@/motion';
import { composeEventHandlers } from '@/utils/composeEventHandlers';

import { TooltipGroupContext, type TooltipGroupItem } from './groupContext';
import { useStyles } from './style';
import type { TooltipProps } from './type';

const TooltipInGroup: FC<TooltipProps> = ({
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
  mouseEnterDelay = 0,
  mouseLeaveDelay = 0,
  onOpenChange,
  disabled,
  classNames,
  styles: styleProps,
  zIndex,
  portalled = true,
  getPopupContainer,
}) => {
  const group = useContext(TooltipGroupContext);
  const triggerElRef = useRef<HTMLElement | null>(null);

  const item: TooltipGroupItem = useMemo(
    () => ({
      arrow,
      className,
      classNames,
      closeDelay,
      disabled,
      getPopupContainer,
      hotkey,
      hotkeyProps,
      mouseEnterDelay,
      mouseLeaveDelay,
      onOpenChange,
      openDelay,
      placement,
      portalled,
      styles: styleProps,
      title,
      zIndex,
    }),
    [
      arrow,
      className,
      classNames,
      closeDelay,
      disabled,
      getPopupContainer,
      hotkey,
      hotkeyProps,
      mouseEnterDelay,
      mouseLeaveDelay,
      onOpenChange,
      openDelay,
      placement,
      portalled,
      styleProps,
      title,
      zIndex,
    ],
  );

  const trigger = useMemo(() => {
    if (!isValidElement(children)) return <span>{children}</span>;

    const needsWrapper =
      typeof children.type === 'string' && Boolean((children.props as any)?.disabled);

    if (needsWrapper) return <span style={{ display: 'inline-flex' }}>{children}</span>;

    return children;
  }, [children]);

  const referenceNode = useMemo(() => {
    if (!isValidElement(trigger)) return trigger;

    const originalRef = (trigger as any).ref;
    const triggerProps: any = trigger.props || {};

    const setTriggerEl = (node: any) => {
      triggerElRef.current = node instanceof HTMLElement ? node : null;
    };

    return cloneElement(trigger as any, {
      ...triggerProps,
      onBlur: composeEventHandlers(triggerProps.onBlur, (e: any) => {
        group?.closeFromTrigger(e.currentTarget as HTMLElement, item);
      }),
      onFocus: composeEventHandlers(triggerProps.onFocus, (e: any) => {
        group?.openFromTrigger(e.currentTarget as HTMLElement, item);
      }),
      onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (e: any) => {
        if (e?.key === 'Escape') group?.closeImmediately();
      }),
      onPointerEnter: composeEventHandlers(triggerProps.onPointerEnter, (e: any) => {
        group?.openFromTrigger(e.currentTarget as HTMLElement, item);
      }),
      onPointerLeave: composeEventHandlers(triggerProps.onPointerLeave, (e: any) => {
        group?.closeFromTrigger(e.currentTarget as HTMLElement, item);
      }),
      ref: mergeRefs([originalRef, setTriggerEl, ref]),
    });
  }, [group, item, ref, trigger]);

  useEffect(() => {
    return () => {
      if (!group) return;
      const el = triggerElRef.current;
      if (el && group.isActiveTrigger(el)) group.closeImmediately();
    };
  }, [group]);

  return referenceNode as any;
};

TooltipInGroup.displayName = 'TooltipInGroup';

const TooltipStandalone: FC<TooltipProps> = ({
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
  mouseEnterDelay = 0,
  mouseLeaveDelay = 0,
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
  const { styles, cx } = useStyles();
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

  const mergedOpen = open ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const floatingPlacement = useMemo(() => antdPlacementToFloating(placement), [placement]);

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
    if (arrow) base.push(arrowMiddleware({ element: arrowRef }));
    return base;
  }, [arrow]);

  const { context, floatingStyles, refs } = useFloating({
    middleware,
    onOpenChange: setOpen,
    open: disabled ? false : mergedOpen,
    placement: floatingPlacement,
    whileElementsMounted: autoUpdate,
  });

  const resolvedDelay = useMemo(
    () => ({
      close: closeDelay ?? mouseLeaveDelay * 1000,
      open: openDelay ?? mouseEnterDelay * 1000,
    }),
    [closeDelay, mouseEnterDelay, mouseLeaveDelay, openDelay],
  );

  const hover = useHover(context, {
    delay: resolvedDelay,
    enabled: !disabled,
    move: false,
  });
  const focus = useFocus(context, { enabled: !disabled });
  const dismiss = useDismiss(context, { enabled: !disabled });
  const role = useRole(context, { role: 'tooltip' });

  const { getFloatingProps, getReferenceProps } = useInteractions([hover, focus, dismiss, role]);

  const trigger = useMemo(() => {
    if (!isValidElement(children)) return <span>{children}</span>;

    const needsWrapper =
      typeof children.type === 'string' && Boolean((children.props as any)?.disabled);

    if (needsWrapper) return <span style={{ display: 'inline-flex' }}>{children}</span>;

    return children;
  }, [children]);

  const referenceNode = useMemo(() => {
    if (!isValidElement(trigger)) return trigger;

    const originalRef = (trigger as any).ref;

    return cloneElement(
      trigger as any,
      getReferenceProps({
        ...(trigger.props as any),
        ref: mergeRefs([originalRef, refs.setReference, ref]),
      }),
    );
  }, [getReferenceProps, ref, refs.setReference, trigger]);

  const portalRoot =
    getPopupContainer && refs.reference.current
      ? getPopupContainer(refs.reference.current as any)
      : undefined;

  const floatingNode = (
    <LazyMotion>
      <AnimatePresence>
        {mergedOpen && title && (
          <m.div
            animate={{ opacity: 1 }}
            className={cx(styles.tooltip, classNames?.container, classNames?.root, className)}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="tooltip"
            ref={refs.setFloating}
            style={
              styleProps?.root
                ? {
                    ...floatingStyles,
                    zIndex,
                    ...styleProps.container,
                    ...styleProps.root,
                  }
                : { ...floatingStyles, zIndex, ...styleProps?.container }
            }
            transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            {...getFloatingProps()}
          >
            <m.div
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              initial={{ scale: 0.96 }}
              style={{ transformOrigin }}
              transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={cx(styles.content, classNames?.content)} style={styleProps?.content}>
                {hotkey ? (
                  <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
                    <span>{title}</span>
                    <Hotkey inverseTheme keys={hotkey} {...hotkeyProps} />
                  </Flexbox>
                ) : (
                  title
                )}
              </div>
              {arrow && (
                <FloatingArrow
                  className={cx(styles.arrow, classNames?.arrow)}
                  context={context}
                  height={6}
                  ref={arrowRef}
                  style={styleProps?.arrow}
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
    <>
      {referenceNode}
      {!disabled &&
        title &&
        (portalled ? (
          <FloatingPortal root={portalRoot}>{floatingNode}</FloatingPortal>
        ) : (
          floatingNode
        ))}
    </>
  );
};

export const Tooltip: FC<TooltipProps> = (props) => {
  const group = useContext(TooltipGroupContext);

  // Group mode is intentionally hover/focus driven; keep standalone behavior for controlled cases.
  const canUseGroup = Boolean(group) && props.open === undefined && props.defaultOpen === undefined;

  return canUseGroup ? <TooltipInGroup {...props} /> : <TooltipStandalone {...props} />;
};

export default Tooltip;
