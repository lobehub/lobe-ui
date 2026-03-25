import { ActionIcon, Button, DropdownMenu, Flexbox, Popover, Tag } from '@lobehub/ui';
import { Folder, MoreHorizontal } from 'lucide-react';

import { items } from '@/DropdownMenu/demos/data';

export default () => {
  return (
    <Flexbox align="center" justify="center" style={{ padding: 48 }}>
      <Popover
        arrow={false}
        placement="bottomLeft"
        trigger="click"
        content={
          <Flexbox gap={16} style={{ padding: '12px 16px', width: 300 }}>
            <Flexbox horizontal align="center" justify="space-between">
              <Flexbox horizontal align="center" gap={8}>
                <Folder size={18} style={{ color: 'var(--lobe-color-primary)' }} />
                <div style={{ fontSize: 15, fontWeight: 600 }}>Project Actions</div>
              </Flexbox>
              <DropdownMenu items={items} placement="bottomRight">
                <ActionIcon icon={MoreHorizontal} size="small" />
              </DropdownMenu>
            </Flexbox>
            <Flexbox
              gap={8}
              style={{
                background: 'var(--lobe-color-fill-tertiary)',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Flexbox horizontal align="center" gap={6}>
                <Tag color="purple">Tip</Tag>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Nested Components</div>
              </Flexbox>
              <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, lineHeight: 1.6 }}>
                Click the action button to open a dropdown menu from within a popover. Components
                compose seamlessly.
              </div>
            </Flexbox>
          </Flexbox>
        }
      >
        <Button icon={<Folder size={16} />} size="large" type="primary">
          Open Project Panel
        </Button>
      </Popover>
    </Flexbox>
  );
};
