'use client';

import { type FC, isValidElement, useCallback, useContext, useMemo, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { BaseTooltip } from './baseTooltip';
import TooltipFloating from './TooltipFloating';
import TooltipPortal from './TooltipPortal';
import { TooltipGroupPropsContext } from './groupContext';
import type { TooltipProps } from './type';
import { useMergedTooltipProps } from './useMergedTooltipProps';
import { useTooltipTrigger } from './useTooltipTrigger';
import { resolveTooltipDelays } from './utils';

export const TooltipInGroup: FC<TooltipProps> = ({ ref, children, ...props }) => {
  const trigger = useTooltipTrigger(children);
  const mergedProps = useMergedTooltipProps(props);
  const sharedProps = useContext(TooltipGroupPropsContext);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  const {
    closeDelay,
    mouseEnterDelay,
    mouseLeaveDelay,
    openDelay,
    className,
    classNames,
    hotkey,
    hotkeyProps,
    placement,
    styles: styleProps,
    title,
    zIndex,
    arrow,
    portalled,
    getPopupContainer,
    disabled,
  } = mergedProps;
  const layoutAnimation = sharedProps?.layoutAnimation ?? true;

  const shouldOverrideOpenDelay = openDelay !== undefined || mouseEnterDelay !== undefined;
  const shouldOverrideCloseDelay = closeDelay !== undefined || mouseLeaveDelay !== undefined;
  const resolvedDelays = useMemo(
    () => resolveTooltipDelays({ closeDelay, mouseEnterDelay, mouseLeaveDelay, openDelay }),
    [closeDelay, mouseEnterDelay, mouseLeaveDelay, openDelay],
  );

  const portalRoot = useMemo(() => {
    if (!triggerEl) return undefined;
    if (portalled === false) return triggerEl.parentElement ?? undefined;
    if (getPopupContainer) return getPopupContainer(triggerEl);
    return undefined;
  }, [getPopupContainer, portalled, triggerEl]);

  const triggerRef = useMemo(
    () =>
      mergeRefs([
        ref,
        (node) => setTriggerEl(node instanceof HTMLElement ? node : null),
      ]),
    [ref],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      mergedProps.onOpenChange?.(nextOpen);
    },
    [mergedProps],
  );

  return (
    <BaseTooltip.Root disabled={disabled} onOpenChange={(nextOpen) => handleOpenChange(nextOpen)}>
      <BaseTooltip.Trigger
        closeDelay={shouldOverrideCloseDelay ? resolvedDelays.close : undefined}
        delay={shouldOverrideOpenDelay ? resolvedDelays.open : undefined}
        ref={triggerRef}
        render={isValidElement(trigger) ? trigger : undefined}
      >
        {isValidElement(trigger) ? undefined : trigger}
      </BaseTooltip.Trigger>
      {!disabled && title && (
        <TooltipPortal root={portalRoot}>
          <TooltipFloating
            arrow={arrow}
            className={className}
            classNames={classNames}
            hotkey={hotkey}
            hotkeyProps={hotkeyProps}
            layoutAnimation={layoutAnimation}
            placement={placement}
            styles={styleProps}
            title={title}
            zIndex={zIndex}
          />
        </TooltipPortal>
      )}
    </BaseTooltip.Root>
  );
};

TooltipInGroup.displayName = 'TooltipInGroup';
