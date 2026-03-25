import {
  Button,
  Flexbox,
  PopoverArrow,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
  PopoverViewport,
  Tag,
} from '@lobehub/ui';
import { Blocks } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <Flexbox align="center" height={260} justify="center">
      <PopoverRoot open={open} onOpenChange={setOpen}>
        <PopoverTriggerElement>
          <Button icon={<Blocks size={18} />} size="large" type="primary">
            {open ? 'Close' : 'Open'} Primitives
          </Button>
        </PopoverTriggerElement>
        <PopoverPortal>
          <PopoverPositioner placement="bottomLeft">
            <PopoverPopup>
              <PopoverArrow />
              <PopoverViewport>
                <Flexbox gap={12} style={{ padding: '4px 8px' }}>
                  <Flexbox horizontal align="center" gap={8}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Atomic Components</div>
                    <Tag color="blue">Advanced</Tag>
                  </Flexbox>
                  <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13, lineHeight: 1.7 }}>
                    Build fully customized popovers using primitive components for maximum
                    flexibility and control.
                  </div>
                  <Flexbox
                    gap={4}
                    style={{
                      background: 'var(--lobe-color-fill-tertiary)',
                      borderRadius: 6,
                      fontFamily: 'monospace',
                      fontSize: 12,
                      padding: 8,
                    }}
                  >
                    <div>• PopoverRoot</div>
                    <div>• PopoverTrigger</div>
                    <div>• PopoverPortal</div>
                    <div>• PopoverPositioner</div>
                  </Flexbox>
                </Flexbox>
              </PopoverViewport>
            </PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      </PopoverRoot>
    </Flexbox>
  );
};
