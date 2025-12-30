import { useContext, useMemo } from 'react';

import { type TooltipGroupItem, TooltipGroupPropsContext } from './groupContext';
import type { TooltipProps } from './type';

export const useMergedTooltipProps = (props: Partial<TooltipProps>): TooltipGroupItem => {
  const sharedProps = useContext(TooltipGroupPropsContext);

  const {
    className,
    classNames,
    styles: styleProps,
    hotkeyProps,
    onOpenChange,
    arrow,
    closeDelay,
    disabled,
    getPopupContainer,
    hotkey,
    mouseEnterDelay,
    mouseLeaveDelay,
    openDelay,
    placement,
    portalled,
    title,
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

  return item;
};
