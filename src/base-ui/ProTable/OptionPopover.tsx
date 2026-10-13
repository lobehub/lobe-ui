import { type ReactNode } from 'react';

import { PopoverPopup, PopoverPortal, PopoverPositioner, PopoverRoot } from '@/base-ui/Popover';

export interface OptionPopoverProps {
  /** The toolbar icon that was clicked; the popup is positioned against it. */
  anchor: HTMLElement | null;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

/**
 * A controlled popover anchored to an `ActionIconGroup` item. The group only renders plain
 * buttons, so the density menu and column setting panel open from their click handlers.
 */
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
