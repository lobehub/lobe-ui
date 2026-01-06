import { ActionIcon, Button, Flexbox, Input, Popover } from '@lobehub/ui';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('My Project');

  return (
    <Flexbox align="center" gap={24} horizontal justify="center" style={{ padding: 24 }}>
      {/* 删除确认 */}
      <Popover
        content={
          <Flexbox gap={12} style={{ width: 220 }}>
            <div style={{ fontWeight: 500 }}>Delete this item?</div>
            <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13 }}>
              This action cannot be undone.
            </div>
            <Flexbox gap={8} horizontal justify="flex-end">
              <Button onClick={() => setDeleteOpen(false)} size="small">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDeleteOpen(false);
                }}
                size="small"
                type="primary"
              >
                Delete
              </Button>
            </Flexbox>
          </Flexbox>
        }
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
        placement="bottom"
        trigger="click"
      >
        <ActionIcon icon={Trash2} />
      </Popover>

      {/* 快速编辑 */}
      <Popover
        content={
          <Flexbox gap={12} style={{ width: 240 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Rename</div>
            <Input
              onChange={(e) => setName(e.target.value)}
              onPressEnter={() => setEditOpen(false)}
              placeholder="Enter name"
              value={name}
            />
            <Flexbox gap={8} horizontal justify="flex-end">
              <Button onClick={() => setEditOpen(false)} size="small">
                Cancel
              </Button>
              <Button onClick={() => setEditOpen(false)} size="small" type="primary">
                Save
              </Button>
            </Flexbox>
          </Flexbox>
        }
        onOpenChange={setEditOpen}
        open={editOpen}
        placement="bottom"
        trigger="click"
      >
        <Button onClick={() => setEditOpen(true)}>{name}</Button>
      </Popover>

      {/* 外部控制 */}
      <Button onClick={() => setEditOpen(true)} type="text">
        Edit name
      </Button>
    </Flexbox>
  );
};
