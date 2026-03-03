import { Button, Flexbox, Popover as LobePopover, Text, Tooltip as LobeTooltip } from '@lobehub/ui';
import { createModalSystem, Modal, Select as LobeSelect } from '@lobehub/ui/base-ui';
import { Popover, Select, Space, Tooltip } from 'antd';
import { cssVar } from 'antd-style';
import { useState } from 'react';

const { ModalHost, confirmModal } = createModalSystem();

// --- 1. Share Modal (large, fullscreen toggle, no footer) ---
const ShareModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Share Modal</Button>
      <Modal
        allowFullscreen
        footer={null}
        height="70vh"
        open={open}
        styles={{ body: { padding: 0 } }}
        title="Share"
        width="min(90vw, 1024px)"
        onCancel={() => setOpen(false)}
      >
        <Flexbox
          align="center"
          justify="center"
          style={{ background: cssVar.colorFillTertiary, height: '100%' }}
        >
          <Text style={{ opacity: 0.45 }}>Preview Area</Text>
        </Flexbox>
      </Modal>
    </>
  );
};

// --- 2. Config/Settings Modal (destroyOnHidden, standard) ---
const ConfigModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings Modal</Button>
      <Modal
        destroyOnHidden
        maskClosable
        cancelText="Cancel"
        okText="Save"
        open={open}
        title="MCP Settings"
        width={600}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flexbox gap={12}>
          <Text as="p">Server Name: local-mcp</Text>
          <Text as="p">Endpoint: http://localhost:3100</Text>
          <Text as="p">Status: Connected</Text>
        </Flexbox>
      </Modal>
    </>
  );
};

// --- 3. Profile Setup (title hidden, closable control, cancelButton hidden) ---
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
      <Button onClick={() => setOpen(true)}>Profile Setup</Button>
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
            Choose a display name and avatar to get started.
          </Text>
          <input
            placeholder="Display Name"
            style={{
              background: cssVar.colorBgContainer,
              border: `1px solid ${cssVar.colorBorder}`,
              borderRadius: 8,
              fontSize: 14,
              height: 40,
              padding: '0 12px',
              width: '100%',
            }}
          />
        </Flexbox>
      </Modal>
    </>
  );
};

// --- 4. Interactivity Modal (popover & select/tooltip test) ---
const PopoverModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Popover & Select Modal</Button>
      <Modal
        destroyOnHidden
        open={open}
        title="Interactivity Test"
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flexbox gap={16} style={{ minHeight: 120, padding: '12px 0' }}>
          <Text style={{ fontWeight: 600 }}>Antd Components:</Text>
          <Space>
            <Tooltip title="This is a tooltip inside modal">
              <Button>Antd Tooltip</Button>
            </Tooltip>

            <Popover
              content="This is an antd popover content"
              title="Popover Title"
              trigger="click"
            >
              <Button>Antd Popover</Button>
            </Popover>

            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'disabled', label: 'Disabled', disabled: true },
              ]}
            />
          </Space>

          <Text style={{ fontWeight: 600, marginTop: 12 }}>Lobe UI Components:</Text>
          <Space>
            <LobeTooltip title="This is a lobe-ui tooltip inside modal">
              <Button>Lobe Tooltip</Button>
            </LobeTooltip>

            <LobePopover
              content={<div style={{ padding: 12 }}>This is a lobe-ui popover content</div>}
            >
              <Button>Lobe Popover</Button>
            </LobePopover>

            <LobeSelect
              defaultValue="lucy"
              style={{ width: 120 }}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'disabled', label: 'Disabled', disabled: true },
              ]}
            />
          </Space>
        </Flexbox>
      </Modal>
    </>
  );
};

// --- 5. Confirm Dialog (Modal.confirm with danger) ---
const ConfirmDemo = () => {
  const handleConfirm = () => {
    confirmModal({
      content: 'This action cannot be undone. Your data will be permanently deleted.',
      okButtonProps: { danger: true },
      okText: 'Delete',
      onOk: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      title: 'Delete Account',
    });
  };

  const handleSimpleConfirm = () => {
    confirmModal({
      content: 'Are you sure you want to apply the .gitignore filter? 12 files will be excluded.',
      okText: 'Apply',
      onOk: () => {},
      title: 'Apply Filter',
    });
  };

  return (
    <Flexbox horizontal gap={12}>
      <Button onClick={handleConfirm}>Danger Confirm</Button>
      <Button onClick={handleSimpleConfirm}>Simple Confirm</Button>
    </Flexbox>
  );
};

// --- Main ---
export default () => (
  <Flexbox horizontal gap={16} wrap="wrap">
    <ShareModalDemo />
    <ConfigModalDemo />
    <ProfileSetupDemo />
    <PopoverModalDemo />
    <ConfirmDemo />
    <ModalHost />
  </Flexbox>
);
