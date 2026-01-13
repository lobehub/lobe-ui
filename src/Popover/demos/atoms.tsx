import {
  Button,
  PopoverArrow,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
  PopoverViewport,
} from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot onOpenChange={setOpen} open={open}>
      <PopoverTriggerElement>
        <Button type="primary">{open ? 'Close' : 'Open'} (Atom)</Button>
      </PopoverTriggerElement>
      <PopoverPortal>
        <PopoverPositioner placement="bottomLeft">
          <PopoverPopup>
            <PopoverArrow />
            <PopoverViewport>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Atom Popover</div>
              <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, lineHeight: 1.6 }}>
                You can compose popover primitives to build custom layouts.
              </div>
            </PopoverViewport>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  );
};
