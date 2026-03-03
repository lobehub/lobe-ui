import { Button, Flexbox, Popover as LobePopover, Text, Tooltip as LobeTooltip } from '@lobehub/ui';
import { createModalSystem, Modal, Select as LobeSelect } from '@lobehub/ui/base-ui';
import { Avatar, Popover, Select, Space, Tag, Tooltip } from 'antd';
import { cssVar } from 'antd-style';
import { AlertTriangle, FileText, Share2 } from 'lucide-react';
import { useState } from 'react';

const { ModalHost, confirmModal } = createModalSystem();

// ─── 1. Share Modal：顶部工具栏 ─────────────────────────────────
const ShareModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flexbox
        horizontal
        align="center"
        gap={8}
        style={{
          background: cssVar.colorFillTertiary,
          borderRadius: 8,
          padding: '6px 10px',
        }}
      >
        <Text style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Design System · v2.4</Text>
        <Tooltip title="Copy link">
          <Button icon={<Share2 size={13} />} size="small" onClick={() => setOpen(true)}>
            Share
          </Button>
        </Tooltip>
      </Flexbox>

      <Modal
        allowFullscreen
        footer={null}
        height="70vh"
        open={open}
        styles={{ body: { padding: 0 } }}
        title="Share Preview"
        width="min(90vw, 1024px)"
        onCancel={() => setOpen(false)}
      >
        <Flexbox
          align="center"
          justify="center"
          style={{ background: cssVar.colorFillTertiary, height: '100%' }}
        >
          <Text style={{ opacity: 0.4 }}>Live preview renders here</Text>
        </Flexbox>
      </Modal>
    </>
  );
};

// ─── 2. Settings Modal：设置列表行 ──────────────────────────────
const ConfigModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 一条朴素的设置项，没有额外卡片容器 */}
      <Flexbox
        horizontal
        align="center"
        style={{ cursor: 'pointer', padding: '4px 0' }}
        onClick={() => setOpen(true)}
      >
        <Flexbox flex={1} gap={2}>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>MCP Server</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>local-mcp · http://localhost:3100</Text>
        </Flexbox>
        <Tag color="green" style={{ margin: 0 }}>
          Connected
        </Tag>
      </Flexbox>

      <Modal
        destroyOnHidden
        maskClosable
        cancelText="Cancel"
        okText="Save"
        open={open}
        title="MCP Server Settings"
        width={600}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flexbox gap={16}>
          {[
            { label: 'Server Name', value: 'local-mcp' },
            { label: 'Endpoint', value: 'http://localhost:3100' },
            { label: 'Status', value: 'Connected' },
            { label: 'Protocol', value: 'MCP v1.2' },
          ].map(({ label, value }) => (
            <Flexbox horizontal align="center" justify="space-between" key={label}>
              <Text style={{ fontSize: 13, opacity: 0.6 }}>{label}</Text>
              <Text style={{ fontSize: 13, fontWeight: 500 }}>{value}</Text>
            </Flexbox>
          ))}
        </Flexbox>
      </Modal>
    </>
  );
};

// ─── 3. Profile Setup：欢迎横幅 ─────────────────────────────────
const ProfileSetupDemo = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Flexbox
        horizontal
        align="center"
        gap={12}
        style={{
          background: `color-mix(in srgb, ${cssVar.colorPrimary} 8%, transparent)`,
          borderRadius: 10,
          padding: '12px 16px',
        }}
      >
        <Avatar size={36} style={{ background: cssVar.colorPrimary, flexShrink: 0 }}>
          ?
        </Avatar>
        <Flexbox flex={1} gap={1}>
          <Text style={{ fontWeight: 600 }}>Complete your profile</Text>
          <Text style={{ fontSize: 12, opacity: 0.6 }}>
            Set a display name and avatar to personalize your workspace
          </Text>
        </Flexbox>
        <Button size="small" type="primary" onClick={() => setOpen(true)}>
          Set up
        </Button>
      </Flexbox>

      <Modal
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        confirmLoading={loading}
        keyboard={false}
        maskClosable={false}
        okText="Get Started"
        open={open}
        title={false}
        width={640}
        onOk={handleOk}
      >
        <Flexbox gap={16} style={{ padding: '8px 0' }}>
          <Text as="h3" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            Welcome! Set up your profile
          </Text>
          <Text as="p" style={{ margin: 0, opacity: 0.65 }}>
            Choose a display name to get started.
          </Text>
          <input
            placeholder="Display Name"
            style={{
              background: cssVar.colorBgContainer,
              border: `1px solid ${cssVar.colorBorder}`,
              borderRadius: 8,
              color: cssVar.colorText,
              fontSize: 14,
              height: 40,
              outline: 'none',
              padding: '0 12px',
              width: '100%',
            }}
          />
        </Flexbox>
      </Modal>
    </>
  );
};

// ─── 4. Popover & Select：过滤 chips ────────────────────────────
const PopoverModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flexbox horizontal align="center" gap={6} wrap="wrap">
        <Text style={{ fontSize: 12, opacity: 0.5 }}>Filters:</Text>
        {['Status: All', 'Assignee: Any', 'Priority: High'].map((chip) => (
          <Tag key={chip} style={{ cursor: 'default', margin: 0 }}>
            {chip}
          </Tag>
        ))}
        <a
          style={{ color: cssVar.colorPrimary, cursor: 'pointer', fontSize: 12 }}
          onClick={() => setOpen(true)}
        >
          + Advanced
        </a>
      </Flexbox>

      <Modal
        destroyOnHidden
        open={open}
        title="Advanced Filters"
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flexbox gap={20} style={{ minHeight: 120 }}>
          <Flexbox gap={8}>
            <Text
              style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, textTransform: 'uppercase' }}
            >
              Antd Components
            </Text>
            <Space>
              <Tooltip title="Filter by date range">
                <Button size="small">Date Range</Button>
              </Tooltip>
              <Popover content="Select a category" title="Category Filter" trigger="click">
                <Button size="small">Category</Button>
              </Popover>
              <Select
                defaultValue="lucy"
                size="small"
                style={{ width: 120 }}
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'disabled', label: 'Disabled', disabled: true },
                ]}
              />
            </Space>
          </Flexbox>
          <Flexbox gap={8}>
            <Text
              style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, textTransform: 'uppercase' }}
            >
              Lobe UI Components
            </Text>
            <Space>
              <LobeTooltip title="Filter by assignee">
                <Button size="small">Assignee</Button>
              </LobeTooltip>
              <LobePopover content={<div style={{ padding: 12 }}>Pick a status</div>}>
                <Button size="small">Status</Button>
              </LobePopover>
              <LobeSelect
                defaultValue="lucy"
                size="small"
                style={{ width: 120 }}
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'disabled', label: 'Disabled', disabled: true },
                ]}
              />
            </Space>
          </Flexbox>
        </Flexbox>
      </Modal>
    </>
  );
};

// ─── 5. Confirm：危险区域 + 普通确认 ────────────────────────────
const ConfirmDemo = () => {
  const handleDeleteConfirm = () => {
    confirmModal({
      content:
        'This action cannot be undone. Your account and all data will be permanently deleted.',
      okButtonProps: { danger: true },
      okText: 'Delete Account',
      onOk: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      title: 'Delete Account',
    });
  };

  const handleFilterConfirm = () => {
    confirmModal({
      content: 'Are you sure? 12 tracked files will be excluded from future commits.',
      okText: 'Apply Filter',
      onOk: () => {},
      title: 'Apply .gitignore Filter',
    });
  };

  return (
    <Flexbox
      gap={0}
      style={{
        border: `1px solid ${cssVar.colorErrorBorder}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <Flexbox
        horizontal
        align="center"
        gap={8}
        style={{ padding: '8px 14px', borderBottom: `1px solid ${cssVar.colorErrorBorder}` }}
      >
        <AlertTriangle size={13} style={{ color: cssVar.colorError }} />
        <Text style={{ color: cssVar.colorError, fontSize: 12, fontWeight: 600 }}>Danger Zone</Text>
      </Flexbox>

      <Flexbox
        horizontal
        align="center"
        style={{ padding: '10px 14px', borderBottom: `1px solid ${cssVar.colorBorderSecondary}` }}
      >
        <Flexbox flex={1} gap={1}>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>Delete this account</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>Once deleted, there is no going back.</Text>
        </Flexbox>
        <Button danger size="small" onClick={handleDeleteConfirm}>
          Delete
        </Button>
      </Flexbox>

      <Flexbox horizontal align="center" style={{ padding: '10px 14px' }}>
        <Flexbox flex={1} gap={1}>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>Apply .gitignore filter</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>12 tracked files will be excluded.</Text>
        </Flexbox>
        <Button size="small" onClick={handleFilterConfirm}>
          Apply
        </Button>
      </Flexbox>
    </Flexbox>
  );
};

// ─── 6. Unsaved Changes：动态 maskClosable ──────────────────────
const UnsavedChangesDemo = () => {
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleClose = () => {
    setHasChanges(false);
    setOpen(false);
  };

  return (
    <>
      <Flexbox
        horizontal
        align="center"
        gap={10}
        style={{
          background: cssVar.colorFillTertiary,
          borderRadius: 10,
          padding: '10px 14px',
        }}
      >
        <FileText size={16} style={{ color: cssVar.colorTextSecondary, flexShrink: 0 }} />
        <Flexbox flex={1} gap={1}>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>System Prompt</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>Last edited 2 hours ago</Text>
        </Flexbox>
        <Button size="small" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </Flexbox>

      <Modal
        cancelButtonProps={hasChanges ? {} : { style: { display: 'none' } }}
        cancelText="Discard"
        closable={!hasChanges}
        keyboard={!hasChanges}
        maskClosable={!hasChanges}
        okText={hasChanges ? 'Save' : 'Done'}
        open={open}
        title="Edit System Prompt"
        width={560}
        onCancel={handleClose}
        onOk={handleClose}
      >
        <Flexbox gap={12}>
          <textarea
            placeholder="Type your system prompt here..."
            rows={5}
            style={{
              background: cssVar.colorFillQuaternary,
              border: `1px solid ${cssVar.colorBorder}`,
              borderRadius: 8,
              color: cssVar.colorText,
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: 1.6,
              outline: 'none',
              padding: 12,
              resize: 'vertical',
              width: '100%',
            }}
            onChange={() => {
              if (!hasChanges) setHasChanges(true);
            }}
          />
          {hasChanges && (
            <Text style={{ color: cssVar.colorWarning, fontSize: 12 }}>
              Unsaved changes — click backdrop to see deny animation
            </Text>
          )}
        </Flexbox>
      </Modal>
    </>
  );
};

export default () => (
  <Flexbox gap={14} padding={16} style={{ margin: '0 auto', maxWidth: 600 }}>
    <ShareModalDemo />
    <ConfigModalDemo />
    <ProfileSetupDemo />
    <PopoverModalDemo />
    <ConfirmDemo />
    <UnsavedChangesDemo />
    <ModalHost />
  </Flexbox>
);
