'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { type FC, cloneElement, isValidElement, useCallback, useContext, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useNativeButton } from '@/hooks/useNativeButton';

import { TooltipGroupHandleContext } from './groupContext';
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
      // Base UI's trigger props include `type="button"` by default.
      // If we render into a non-<button> element, that prop is invalid and can warn.
      const resolvedProps = (() => {
        if (isNativeButtonTriggerElement) return renderProps as any;
        // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
        const { type, ref: triggerRef, ...restProps } = renderProps as any;
        return restProps;
      })();

      const mergedProps = mergeProps((childElement as any).props, resolvedProps);
      return cloneElement(childElement as any, {
        ...mergedProps,
        ref: mergeRefs([(childElement as any).ref, (renderProps as any).ref, refProp]),
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
    const isNativeElement = typeof childElement.type === 'string';
    const isClassComponent =
      typeof childElement.type === 'function' &&
      Boolean((childElement.type as any).prototype?.isReactComponent);
    const isForwardRefComponent =
      typeof childElement.type === 'object' &&
      childElement.type !== null &&
      ((childElement.type as any).$$typeof === Symbol.for('react.forward_ref') ||
        ((childElement.type as any).$$typeof === Symbol.for('react.memo') &&
          (childElement.type as any).type?.$$typeof === Symbol.for('react.forward_ref')));
    const shouldWrapTrigger = !isNativeElement && !isClassComponent && !isForwardRefComponent;

    const wrappedRenderTrigger = (renderProps: unknown) => {
      // Base UI's trigger props include `type="button"` by default.
      // If we render into a non-<button> element, that prop is invalid and can warn.
      const resolvedProps = (() => {
        if (isNativeButtonTriggerElement) return renderProps as any;
        // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
        const { type, ref: triggerRef, ...restProps } = renderProps as any;
        return restProps;
      })();

      if (!shouldWrapTrigger) return renderTrigger(renderProps);

      const { style: triggerStyle, ...restProps } = resolvedProps as any;
      return (
        <span
          {...restProps}
          ref={mergeRefs([(renderProps as any).ref, refProp])}
          style={{ display: 'inline-flex', ...triggerStyle }}
        >
          {children}
        </span>
      );
    };

    return (
      <BaseTooltip.Trigger
        handle={group ?? undefined}
        {...triggerProps}
        render={wrappedRenderTrigger}
      />
    );
  }

  return (
    <BaseTooltip.Trigger handle={group ?? undefined} {...triggerProps} ref={refProp}>
      {children}
    </BaseTooltip.Trigger>
  );
};

TooltipInGroup.displayName = 'TooltipInGroup';
