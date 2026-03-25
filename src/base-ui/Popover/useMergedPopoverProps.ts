'use client';

import { useContext, useMemo } from 'react';

import { type PopoverGroupItem, PopoverGroupPropsContext } from './groupContext';
import type { PopoverProps } from './type';

export const useMergedPopoverProps = (props: Partial<PopoverProps>): PopoverGroupItem => {
  const sharedProps = useContext(PopoverGroupPropsContext);

  const {
    arrow,
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
    nativeButton,
    openDelay,
    zIndex,
    positionerProps,
    triggerProps,
    popupProps,
    backdropProps,
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
      arrow: arrow ?? sharedProps?.arrow ?? false,
      backdropProps: backdropProps ?? sharedProps?.backdropProps,
      className: mergedClassName,
      classNames: mergedClassNames,
      closeDelay: closeDelay ?? sharedProps?.closeDelay,
      content,
      disabled: disabled ?? sharedProps?.disabled,
      getPopupContainer: getPopupContainer ?? sharedProps?.getPopupContainer,
      mouseEnterDelay: mouseEnterDelay ?? sharedProps?.mouseEnterDelay,
      mouseLeaveDelay: mouseLeaveDelay ?? sharedProps?.mouseLeaveDelay,
      nativeButton: nativeButton ?? sharedProps?.nativeButton,
      onOpenChange: mergedOnOpenChange,
      openDelay: openDelay ?? sharedProps?.openDelay,
      placement: placement ?? sharedProps?.placement ?? 'top',
      popupProps: popupProps ?? sharedProps?.popupProps,
      positionerProps: positionerProps ?? sharedProps?.positionerProps,
      styles: mergedStyles,
      trigger: trigger ?? sharedProps?.trigger ?? 'hover',
      triggerProps: triggerProps ?? sharedProps?.triggerProps,
      zIndex: zIndex ?? sharedProps?.zIndex,
    }),
    [
      arrow,
      backdropProps,
      closeDelay,
      content,
      disabled,
      getPopupContainer,
      mergedClassName,
      mergedClassNames,
      mergedOnOpenChange,
      mergedStyles,
      mouseEnterDelay,
      mouseLeaveDelay,
      nativeButton,
      openDelay,
      placement,
      popupProps,
      positionerProps,
      sharedProps?.arrow,
      sharedProps?.backdropProps,
      sharedProps?.closeDelay,
      sharedProps?.disabled,
      sharedProps?.getPopupContainer,
      sharedProps?.mouseEnterDelay,
      sharedProps?.mouseLeaveDelay,
      sharedProps?.nativeButton,
      sharedProps?.openDelay,
      sharedProps?.placement,
      sharedProps?.popupProps,
      sharedProps?.positionerProps,
      sharedProps?.trigger,
      sharedProps?.triggerProps,
      sharedProps?.zIndex,
      trigger,
      triggerProps,
      zIndex,
    ],
  );

  return item;
};
