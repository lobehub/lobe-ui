'use client';

import {
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
import { mergeRefs } from 'react-merge-refs';

import { antdPlacementToFloating } from '@/Tooltip/antdPlacementToFloating';
import { composeEventHandlers } from '@/utils/composeEventHandlers';

import TooltipFloating from './TooltipFloating';
import TooltipPortal from './TooltipPortal';
import { TooltipGroupContext, type TooltipGroupItem } from './groupContext';
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
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

  const mergedOpen = open ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const floatingPlacement = useMemo(() => antdPlacementToFloating(placement), [placement]);

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
      open={mergedOpen}
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

export const Tooltip: FC<TooltipProps> = (props) => {
  const group = useContext(TooltipGroupContext);

  // Group mode is intentionally hover/focus driven; keep standalone behavior for controlled cases.
  const canUseGroup = Boolean(group) && props.open === undefined && props.defaultOpen === undefined;

  return canUseGroup ? <TooltipInGroup {...props} /> : <TooltipStandalone {...props} />;
};

export default Tooltip;
