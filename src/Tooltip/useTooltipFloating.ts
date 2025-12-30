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
import type { FloatingContext, Placement } from '@floating-ui/react';
import { useMemo, useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';

import { antdPlacementToFloating } from '@/Tooltip/antdPlacementToFloating';

import type { TooltipPlacement } from './type';

interface UseTooltipFloatingReturn {
  arrowRef: RefObject<SVGSVGElement | null>;
  context: FloatingContext;
  floatingPlacement: Placement;
  floatingStyles: CSSProperties;
  getFloatingProps: (userProps?: any) => Record<string, unknown>;
  getReferenceProps: (userProps?: any) => Record<string, unknown>;
  refs: ReturnType<typeof useFloating>['refs'];
}

export const useTooltipFloating = ({
  arrow,
  placement,
  openDelay,
  closeDelay,
  mouseEnterDelay,
  mouseLeaveDelay,
  disabled,
  open,
  onOpenChange,
}: {
  arrow?: boolean;
  closeDelay?: number;
  disabled?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  openDelay?: number;
  placement: TooltipPlacement;
}): UseTooltipFloatingReturn => {
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const floatingPlacement = useMemo(() => antdPlacementToFloating(placement), [placement]);

  const middleware = useMemo(() => {
    const base = [offset(8), flip(), shift({ padding: 8 })];
    if (arrow) base.push(arrowMiddleware({ element: arrowRef }));
    return base;
  }, [arrow]);

  const { context, floatingStyles, refs } = useFloating({
    middleware,
    onOpenChange,
    open,
    placement: floatingPlacement,
    whileElementsMounted: autoUpdate,
  });

  const resolvedDelay = useMemo(
    () => ({
      close: closeDelay ?? (mouseLeaveDelay !== undefined ? mouseLeaveDelay * 1000 : 100),
      open: openDelay ?? (mouseEnterDelay !== undefined ? mouseEnterDelay * 1000 : 400),
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

  return {
    arrowRef,
    context,
    floatingPlacement,
    floatingStyles,
    getFloatingProps,
    getReferenceProps,
    refs,
  };
};
