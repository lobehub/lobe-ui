import { ActionIcon, Button, DropdownMenu, Flexbox, Popover } from '@lobehub/ui';
import { MoreHorizontal } from 'lucide-react';

import { items } from '@/DropdownMenu/demos/data';

export default () => {
  return (
    <Popover
      arrow={false}
      content={
        <Flexbox gap={12} style={{ width: 260 }}>
          <Flexbox align="center" horizontal justify="space-between">
            <div style={{ fontWeight: 600 }}>Project actions</div>
            <DropdownMenu items={items} placement="bottomRight">
              <ActionIcon icon={MoreHorizontal} />
            </DropdownMenu>
          </Flexbox>
          <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
            Use the action button to manage the project from inside a popover.
          </div>
        </Flexbox>
      }
      placement="bottomLeft"
      trigger="click"
    >
      <Button>Open Popover</Button>
    </Popover>
  );
};
