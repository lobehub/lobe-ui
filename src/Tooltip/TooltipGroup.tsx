'use client';

import { type FC, type ReactNode, useMemo } from 'react';

import { BaseTooltip } from './baseTooltip';
import {
  TooltipGroupPropsContext,
  type TooltipGroupSharedProps,
} from './groupContext';
import { resolveTooltipDelays } from './utils';

type TooltipGroupProps = TooltipGroupSharedProps & {
  children: ReactNode;
};

const TooltipGroup: FC<TooltipGroupProps> = ({
  children,
  layoutAnimation = true,
  ...sharedProps
}) => {
  const delays = useMemo(
    () =>
      resolveTooltipDelays({
        closeDelay: sharedProps.closeDelay,
        mouseEnterDelay: sharedProps.mouseEnterDelay,
        mouseLeaveDelay: sharedProps.mouseLeaveDelay,
        openDelay: sharedProps.openDelay,
      }),
    [
      sharedProps.closeDelay,
      sharedProps.mouseEnterDelay,
      sharedProps.mouseLeaveDelay,
      sharedProps.openDelay,
    ],
  );

  return (
    <BaseTooltip.Provider closeDelay={delays.close} delay={delays.open}>
      <TooltipGroupPropsContext.Provider value={{ ...sharedProps, layoutAnimation }}>
        {children}
      </TooltipGroupPropsContext.Provider>
    </BaseTooltip.Provider>
  );
};

export default TooltipGroup;
