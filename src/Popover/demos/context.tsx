import { Button, Flexbox, Popover, usePopoverContext } from '@lobehub/ui';
import { CheckCircle2, X } from 'lucide-react';

const Content = () => {
  const { close } = usePopoverContext();
  return (
    <Flexbox gap={12} style={{ width: 280 }}>
      <Flexbox gap={8} horizontal>
        <CheckCircle2 size={20} style={{ color: 'var(--lobe-color-success)', marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Using Popover Context</div>
          <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13 }}>
            The content can access the popover context to close itself imperatively without
            switching to controlled mode.
          </div>
        </div>
      </Flexbox>
      <Flexbox gap={8} horizontal justify="flex-end">
        <Button onClick={close} size="small" type="text">
          Cancel
        </Button>
        <Button icon={X} onClick={close} size="small" type="primary">
          Close
        </Button>
      </Flexbox>
    </Flexbox>
  );
};

export default () => {
  return (
    <Flexbox align="center" justify="center" style={{ padding: 48 }}>
      <Popover content={<Content />} placement="bottom" trigger="click">
        <Button type="primary">Click to open Popover</Button>
      </Popover>
    </Flexbox>
  );
};
