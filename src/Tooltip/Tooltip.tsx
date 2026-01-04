'use client';

import { type FC, useContext } from 'react';

import { TooltipInGroup } from './TooltipInGroup';
import { TooltipStandalone } from './TooltipStandalone';
import { TooltipGroupPropsContext } from './groupContext';
import type { TooltipProps } from './type';

export const Tooltip: FC<TooltipProps> = (props) => {
  const group = useContext(TooltipGroupPropsContext);

  // Group mode is intentionally hover/focus driven; keep standalone behavior for controlled cases.
  const canUseGroup = Boolean(group) && props.open === undefined && props.defaultOpen === undefined;

  return canUseGroup ? <TooltipInGroup {...props} /> : <TooltipStandalone {...props} />;
};

export default Tooltip;
