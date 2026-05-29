'use client';

import { type FC, use } from 'react';

import { TooltipGroupHandleContext } from './groupContext';
import { TooltipInGroup } from './TooltipInGroup';
import { TooltipStandalone } from './TooltipStandalone';
import { type TooltipProps } from './type';

export const Tooltip: FC<TooltipProps> = (props) => {
  const group = use(TooltipGroupHandleContext);

  const canUseGroup =
    Boolean(group) &&
    props.open === undefined &&
    props.defaultOpen === undefined &&
    !props.standalone;

  return canUseGroup ? <TooltipInGroup {...props} /> : <TooltipStandalone {...props} />;
};

export default Tooltip;
