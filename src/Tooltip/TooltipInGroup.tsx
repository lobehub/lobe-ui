'use client';

import {
  type FC,
  type ReactNode,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

import { composeEventHandlers } from '@/utils/composeEventHandlers';

import { TooltipGroupApiContext } from './groupContext';
import type { TooltipProps } from './type';
import { useMergedTooltipProps } from './useMergedTooltipProps';
import { useTooltipTrigger } from './useTooltipTrigger';

export const TooltipInGroup: FC<TooltipProps> = ({ ref, children, ...props }) => {
  const group = useContext(TooltipGroupApiContext);
  const triggerElRef = useRef<HTMLElement | null>(null);
  const item = useMergedTooltipProps(props);
  const trigger = useTooltipTrigger(children);

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

  // Close when the trigger is swapped out or disconnected.
  useEffect(() => {
    return () => {
      if (!group) return;
      const el = triggerElRef.current;
      if (el && group.isActiveTrigger(el)) group.closeImmediately();
    };
  }, [group]);

  return referenceNode as ReactNode;
};

TooltipInGroup.displayName = 'TooltipInGroup';
