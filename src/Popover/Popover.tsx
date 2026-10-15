'use client';

import { type FC, use } from 'react';

import { PopoverGroupHandleContext } from './groupContext';
import { PopoverInGroup } from './PopoverInGroup';
import { PopoverStandalone } from './PopoverStandalone';
import { type PopoverProps } from './type';

export { parseTrigger } from '@/utils/parseTrigger';

const Popover: FC<PopoverProps> = (props) => {
  const group = use(PopoverGroupHandleContext);

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
