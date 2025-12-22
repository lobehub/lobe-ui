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
import {
  TooltipGroupApiContext,
  type TooltipGroupItem,
  TooltipGroupPropsContext,
} from './groupContext';
import type { TooltipProps } from './type';

const TooltipInGroup: FC<TooltipProps> = ({
  ref,
  hotkey,
  className,
  arrow,
  title,
  hotkeyProps,
  children,
  placement,
  openDelay,
  closeDelay,
  mouseEnterDelay,
  mouseLeaveDelay,
  onOpenChange,
  disabled,
  classNames,
  styles: styleProps,
  zIndex,
  portalled,
  getPopupContainer,
}) => {
  const group = useContext(TooltipGroupApiContext);
  const sharedProps = useContext(TooltipGroupPropsContext);
  const triggerElRef = useRef<HTMLElement | null>(null);

  const mergedClassName = useMemo(() => {
    if (!sharedProps?.className && !className) return undefined;
    return [sharedProps?.className, className].filter(Boolean).join(' ');
  }, [className, sharedProps?.className]);

  const mergedClassNames = useMemo(() => {
    if (!sharedProps?.classNames && !classNames) return undefined;
    return { ...sharedProps?.classNames, ...classNames };
  }, [classNames, sharedProps?.classNames]);

  const mergedStyles = useMemo(() => {
    if (!sharedProps?.styles && !styleProps) return undefined;
    return { ...sharedProps?.styles, ...styleProps };
  }, [sharedProps?.styles, styleProps]);

  const mergedHotkeyProps = useMemo(() => {
    if (!sharedProps?.hotkeyProps && !hotkeyProps) return undefined;
    return { ...sharedProps?.hotkeyProps, ...hotkeyProps };
  }, [hotkeyProps, sharedProps?.hotkeyProps]);

  const mergedOnOpenChange = useMemo(() => {
    if (!sharedProps?.onOpenChange && !onOpenChange) return undefined;
    return (open: boolean) => {
      sharedProps?.onOpenChange?.(open);
      onOpenChange?.(open);
    };
  }, [onOpenChange, sharedProps?.onOpenChange]);

  const item: TooltipGroupItem = useMemo(
    () => ({
      arrow: arrow ?? sharedProps?.arrow ?? false,
      className: mergedClassName,
      classNames: mergedClassNames,
      closeDelay: closeDelay ?? sharedProps?.closeDelay,
      disabled: disabled ?? sharedProps?.disabled,
      getPopupContainer: getPopupContainer ?? sharedProps?.getPopupContainer,
      hotkey: hotkey ?? sharedProps?.hotkey,
      hotkeyProps: mergedHotkeyProps,
      mouseEnterDelay: mouseEnterDelay ?? sharedProps?.mouseEnterDelay,
      mouseLeaveDelay: mouseLeaveDelay ?? sharedProps?.mouseLeaveDelay,
      onOpenChange: mergedOnOpenChange,
      openDelay: openDelay ?? sharedProps?.openDelay,
      placement: placement ?? sharedProps?.placement ?? 'top',
      portalled: portalled ?? sharedProps?.portalled,
      styles: mergedStyles,
      title,
      zIndex: zIndex ?? sharedProps?.zIndex,
    }),
    [
      arrow,
      closeDelay,
      disabled,
      getPopupContainer,
      hotkey,
      mergedClassName,
      mergedClassNames,
      mergedHotkeyProps,
      mergedOnOpenChange,
      mergedStyles,
      mouseEnterDelay,
      mouseLeaveDelay,
      openDelay,
      placement,
      portalled,
      sharedProps?.arrow,
      sharedProps?.closeDelay,
      sharedProps?.disabled,
      sharedProps?.getPopupContainer,
      sharedProps?.hotkey,
      sharedProps?.mouseEnterDelay,
      sharedProps?.mouseLeaveDelay,
      sharedProps?.openDelay,
      sharedProps?.placement,
      sharedProps?.portalled,
      sharedProps?.zIndex,
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
      close: closeDelay ?? (mouseLeaveDelay !== undefined ? mouseLeaveDelay * 1000 : 100),
      open: openDelay ?? (mouseEnterDelay !== undefined ? mouseEnterDelay * 1000 : 100),
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
  const group = useContext(TooltipGroupApiContext);

  // Group mode is intentionally hover/focus driven; keep standalone behavior for controlled cases.
  const canUseGroup = Boolean(group) && props.open === undefined && props.defaultOpen === undefined;

  return canUseGroup ? <TooltipInGroup {...props} /> : <TooltipStandalone {...props} />;
};

export default Tooltip;
