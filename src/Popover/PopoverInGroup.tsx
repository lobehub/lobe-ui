'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cx } from 'antd-style';
import { type FC, cloneElement, isValidElement, useContext, useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useNativeButton } from '@/hooks/useNativeButton';

import { PopoverGroupHandleContext } from './groupContext';
import { parseTrigger } from './parseTrigger';
import type { PopoverProps } from './type';
import { useMergedPopoverProps } from './useMergedPopoverProps';

export const PopoverInGroup: FC<PopoverProps> = ({ children, ref: refProp, ...props }) => {
  const group = useContext(PopoverGroupHandleContext);
  const item = useMergedPopoverProps(props);

  const { openOnHover } = useMemo(() => parseTrigger(item.trigger ?? 'hover'), [item.trigger]);

  const resolvedOpenDelay = item.openDelay ?? (item.mouseEnterDelay ?? 0.1) * 1000;
  const resolvedCloseDelay = item.closeDelay ?? (item.mouseLeaveDelay ?? 0.1) * 1000;
  const disabled = Boolean(item.disabled);

  const { isNativeButtonTriggerElement, resolvedNativeButton } = useNativeButton({
    children,
    nativeButton: item.nativeButton,
  });

  // Don't render trigger behavior if no content
  if (!item.content) {
    return children as any;
  }

  const triggerProps = {
    closeDelay: resolvedCloseDelay,
    delay: resolvedOpenDelay,
    disabled,
    openOnHover: openOnHover && !disabled,
    payload: item,
  };

  const triggerClassName = item.classNames?.trigger;

  if (isValidElement(children)) {
    return (
      <BasePopover.Trigger
        handle={group ?? undefined}
        {...triggerProps}
        nativeButton={resolvedNativeButton}
        render={(renderProps) => {
          // Base UI's trigger props include `type="button"` by default.
          // If we render into a non-<button> element, that prop is invalid and can warn.
          const resolvedProps = (() => {
            if (isNativeButtonTriggerElement) return renderProps as any;
            // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
            const { type, ref: triggerRef, ...restProps } = renderProps as any;
            return restProps;
          })();

          const mergedProps = mergeProps((children as any).props, resolvedProps);
          return cloneElement(children as any, {
            ...mergedProps,
            className: cx(mergedProps.className, triggerClassName),
            ref: mergeRefs([(children as any).ref, (renderProps as any).ref, refProp]),
          });
        }}
      />
    );
  }

  return (
    <BasePopover.Trigger
      handle={group ?? undefined}
      {...triggerProps}
      className={triggerClassName}
      nativeButton={resolvedNativeButton}
      ref={refProp}
    >
      {children}
    </BasePopover.Trigger>
  );
};

PopoverInGroup.displayName = 'PopoverInGroup';
