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
    !props.standalone &&
    props.variant !== 'a2ui';

  if (canUseGroup) return <PopoverInGroup {...props} />;
  // The A2UI standard popover opens below its trigger, on click.
  if (props.variant === 'a2ui')
    return <PopoverStandalone placement="bottom" trigger="click" {...props} />;
  return <PopoverStandalone {...props} />;
};

Popover.displayName = 'Popover';

export default Popover;
