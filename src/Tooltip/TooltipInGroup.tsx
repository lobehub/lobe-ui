'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { type FC, isValidElement, useCallback, useContext, useMemo } from 'react';

import { useNativeButton } from '@/hooks/useNativeButton';

import { TooltipGroupHandleContext } from './groupContext';
import { renderTooltipTriggerElement } from './triggerUtils';
import type { TooltipProps } from './type';
import { useMergedTooltipProps } from './useMergedTooltipProps';

const DEFAULT_OPEN_DELAY = 400;
const DEFAULT_CLOSE_DELAY = 100;

export const TooltipInGroup: FC<TooltipProps> = ({ children, ref: refProp, ...props }) => {
  const group = useContext(TooltipGroupHandleContext);
  const item = useMergedTooltipProps(props);

  const resolvedOpenDelay = useMemo(() => {
    if (item.openDelay !== undefined) return item.openDelay;
    if (item.mouseEnterDelay !== undefined) return item.mouseEnterDelay * 1000;
    return DEFAULT_OPEN_DELAY;
  }, [item.mouseEnterDelay, item.openDelay]);

  const resolvedCloseDelay = useMemo(() => {
    if (item.closeDelay !== undefined) return item.closeDelay;
    if (item.mouseLeaveDelay !== undefined) return item.mouseLeaveDelay * 1000;
    return DEFAULT_CLOSE_DELAY;
  }, [item.closeDelay, item.mouseLeaveDelay]);

  const disabled = Boolean(item.disabled);

  const { isNativeButtonTriggerElement } = useNativeButton({
    children,
  });

  const childElement = isValidElement(children) ? children : null;

  const renderTrigger = useCallback(
    (renderProps: unknown) => {
      return renderTooltipTriggerElement({
        child: childElement as any,
        isNativeButtonTriggerElement,
        ref: refProp,
        renderProps,
      });
    },
    [childElement, isNativeButtonTriggerElement, refProp],
  );

  // Don't render trigger behavior if no content
  // eslint-disable-next-line eqeqeq
  if (item.title == null && !item.hotkey) {
    return children as any;
  }

  const triggerProps = {
    closeDelay: resolvedCloseDelay,
    delay: resolvedOpenDelay,
    disabled,
    payload: item,
    ...item.triggerProps,
  };

  if (childElement) {
    return (
      <BaseTooltip.Trigger handle={group ?? undefined} {...triggerProps} render={renderTrigger} />
    );
  }

  return (
    <BaseTooltip.Trigger handle={group ?? undefined} {...triggerProps} ref={refProp}>
      {children}
    </BaseTooltip.Trigger>
  );
};

TooltipInGroup.displayName = 'TooltipInGroup';
