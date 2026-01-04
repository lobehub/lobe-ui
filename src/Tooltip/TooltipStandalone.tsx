'use client';

import { type FC, isValidElement, useCallback, useMemo, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { BaseTooltip } from './baseTooltip';
import TooltipFloating from './TooltipFloating';
import TooltipPortal from './TooltipPortal';
import type { TooltipProps } from './type';
import { useTooltipTrigger } from './useTooltipTrigger';
import { resolveTooltipDelays } from './utils';

export const TooltipStandalone: FC<TooltipProps> = ({
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
  const trigger = useTooltipTrigger(children);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

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

  return (
    <BaseTooltip.Root
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={(nextOpen) => handleOpenChange(nextOpen)}
      open={open}
    >
      <BaseTooltip.Trigger
        closeDelay={resolvedDelays.close}
        delay={resolvedDelays.open}
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
            layoutAnimation={false}
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

TooltipStandalone.displayName = 'TooltipStandalone';
