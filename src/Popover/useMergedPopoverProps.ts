'use client';

import { useContext, useMemo } from 'react';

import { type PopoverGroupItem, PopoverGroupPropsContext } from './groupContext';
import type { PopoverProps } from './type';

export const useMergedPopoverProps = (props: Partial<PopoverProps>): PopoverGroupItem => {
  const sharedProps = useContext(PopoverGroupPropsContext);

  const {
    arrow,
    inset,
    trigger,
    placement,
    className,
    classNames,
    styles: styleProps,
    onOpenChange,
    content,
    closeDelay,
    disabled,
    getPopupContainer,
    mouseEnterDelay,
    mouseLeaveDelay,
    openDelay,
    portalled,
    zIndex,
  } = props;

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

  const mergedOnOpenChange = useMemo(() => {
    if (!sharedProps?.onOpenChange && !onOpenChange) return undefined;
    return (open: boolean) => {
      sharedProps?.onOpenChange?.(open);
      onOpenChange?.(open);
    };
  }, [onOpenChange, sharedProps?.onOpenChange]);

  const item: PopoverGroupItem = useMemo(
    () => ({
      arrow: arrow ?? sharedProps?.arrow ?? true,
      className: mergedClassName,
      classNames: mergedClassNames,
      closeDelay: closeDelay ?? sharedProps?.closeDelay,
      content,
      disabled: disabled ?? sharedProps?.disabled,
      getPopupContainer: getPopupContainer ?? sharedProps?.getPopupContainer,
      inset: inset ?? sharedProps?.inset ?? false,
      mouseEnterDelay: mouseEnterDelay ?? sharedProps?.mouseEnterDelay,
      mouseLeaveDelay: mouseLeaveDelay ?? sharedProps?.mouseLeaveDelay,
      onOpenChange: mergedOnOpenChange,
      openDelay: openDelay ?? sharedProps?.openDelay,
      placement: placement ?? sharedProps?.placement ?? 'top',
      portalled: portalled ?? sharedProps?.portalled,
      styles: mergedStyles,
      trigger: trigger ?? sharedProps?.trigger ?? 'hover',
      zIndex: zIndex ?? sharedProps?.zIndex,
    }),
    [
      arrow,
      closeDelay,
      content,
      disabled,
      getPopupContainer,
      inset,
      mergedClassName,
      mergedClassNames,
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
      sharedProps?.inset,
      sharedProps?.mouseEnterDelay,
      sharedProps?.mouseLeaveDelay,
      sharedProps?.openDelay,
      sharedProps?.placement,
      sharedProps?.portalled,
      sharedProps?.trigger,
      sharedProps?.zIndex,
      trigger,
      zIndex,
    ],
  );

  return item;
};
