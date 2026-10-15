import { type ReactNode } from 'react';

import { PopoverPopup, PopoverPortal, PopoverPositioner, PopoverRoot } from '@/Popover';

export interface OptionPopoverProps {
  anchor: HTMLElement | null;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const OptionPopover = ({ anchor, children, onOpenChange, open }: OptionPopoverProps) => (
  <PopoverRoot open={open && !!anchor} onOpenChange={(next) => onOpenChange(next)}>
    <PopoverPortal>
      <PopoverPositioner anchor={anchor} placement="bottomRight" sideOffset={4}>
        <PopoverPopup>{children}</PopoverPopup>
      </PopoverPositioner>
    </PopoverPortal>
  </PopoverRoot>
);

export default OptionPopover;
