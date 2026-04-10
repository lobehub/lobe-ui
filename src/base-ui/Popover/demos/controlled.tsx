import { ActionIcon, Button, Flexbox, Input, Popover, Tag } from '@lobehub/ui';
import { AlertTriangle, Check, Edit3, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('My Awesome Project');

  return (
    <Flexbox horizontal align="center" gap={32} justify="center" style={{ padding: 48 }}>
      {/* 删除确认 */}
      <Flexbox align="center" gap={12}>
        <Popover
          open={deleteOpen}
          placement="bottom"
          trigger="click"
          content={
            <Flexbox gap={16} style={{ padding: '12px 16px', width: 280 }}>
              <Flexbox horizontal align="center" gap={12}>
                <Flexbox
                  align="center"
                  justify="center"
                  style={{
                    background: 'var(--lobe-color-error-bg)',
                    borderRadius: 8,
                    height: 40,
                    width: 40,
                  }}
                >
                  <AlertTriangle size={20} style={{ color: 'var(--lobe-color-error)' }} />
                </Flexbox>
                <Flexbox flex={1} gap={6}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Confirm Deletion</div>
                  <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
                    This action cannot be undone
                  </div>
                </Flexbox>
              </Flexbox>
              <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13, lineHeight: 1.6 }}>
                Are you sure you want to permanently delete this item? All associated data will be
                lost.
              </div>
              <Flexbox horizontal gap={8} justify="flex-end">
                <Button icon={<X size={16} />} size="small" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  icon={<Trash2 size={16} />}
                  size="small"
                  type="primary"
                  onClick={() => {
                    setDeleteOpen(false);
                  }}
                >
                  Delete
                </Button>
              </Flexbox>
            </Flexbox>
          }
          onOpenChange={setDeleteOpen}
        >
          <ActionIcon icon={Trash2} size="large" />
        </Popover>
        <Tag color="red">Danger</Tag>
      </Flexbox>

      {/* 快速编辑 */}
      <Flexbox align="center" gap={12}>
        <Popover
          open={editOpen}
          placement="bottom"
          trigger="click"
          content={
            <Flexbox gap={16} style={{ padding: '12px 16px', width: 300 }}>
              <Flexbox horizontal align="center" gap={8}>
                <Edit3 size={18} style={{ color: 'var(--lobe-color-primary)' }} />
                <div style={{ fontSize: 15, fontWeight: 600 }}>Rename Project</div>
              </Flexbox>
              <Flexbox gap={8}>
                <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
                  Enter a new name for your project
                </div>
                <Input
                  placeholder="Enter project name"
                  size="large"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onPressEnter={() => setEditOpen(false)}
                />
              </Flexbox>
              <Flexbox horizontal gap={8} justify="flex-end">
                <Button size="small" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button
                  icon={<Check size={16} />}
                  size="small"
                  type="primary"
                  onClick={() => setEditOpen(false)}
                >
                  Save
                </Button>
              </Flexbox>
            </Flexbox>
          }
          onOpenChange={setEditOpen}
        >
          <Button
            icon={<Edit3 size={16} />}
            size="large"
            style={{
              fontWeight: 500,
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setEditOpen(true)}
          >
            {name}
          </Button>
        </Popover>
        <Tag color="blue">Editable</Tag>
      </Flexbox>

      {/* 外部控制 */}
      <Button icon={<Edit3 size={16} />} size="large" type="text" onClick={() => setEditOpen(true)}>
        Edit Externally
      </Button>
    </Flexbox>
  );
};
