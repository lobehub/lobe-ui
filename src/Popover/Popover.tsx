'use client';

import { type FC, useContext } from 'react';

import { PopoverInGroup } from './PopoverInGroup';
import { PopoverStandalone } from './PopoverStandalone';
import { PopoverGroupHandleContext } from './groupContext';
import type { PopoverProps } from './type';

export { parseTrigger } from '@/utils/parseTrigger';

const Popover: FC<PopoverProps> = (props) => {
  const group = useContext(PopoverGroupHandleContext);

  // Group mode is driven by trigger interactions; keep standalone behavior for controlled cases.
  const canUseGroup =
    Boolean(group) &&
    props.open === undefined &&
    props.defaultOpen === undefined &&
    !props.standalone;

  return canUseGroup ? <PopoverInGroup {...props} /> : <PopoverStandalone {...props} />;
};

Popover.displayName = 'Popover';

export default Popover;
