'use client';

import { type FC, useContext } from 'react';

import { TooltipInGroup } from './TooltipInGroup';
import { TooltipStandalone } from './TooltipStandalone';
import { TooltipGroupHandleContext } from './groupContext';
import type { TooltipProps } from './type';

export const Tooltip: FC<TooltipProps> = (props) => {
  const group = useContext(TooltipGroupHandleContext);

  const canUseGroup = Boolean(group) && props.open === undefined && props.defaultOpen === undefined;

  return canUseGroup ? <TooltipInGroup {...props} /> : <TooltipStandalone {...props} />;
};

export default Tooltip;
