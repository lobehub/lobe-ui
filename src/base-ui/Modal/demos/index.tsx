import { Button, Flexbox, Text } from '@lobehub/ui';
import { Modal } from '@lobehub/ui/base-ui';
import { Tag } from 'antd';
import { cssVar } from 'antd-style';
import { useState } from 'react';

// ─── 1. Basic Modal：行内预览链接 ───────────────────────────────
const BasicModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flexbox horizontal align="baseline" gap={6}>
        <Text style={{ opacity: 0.65 }}>Q1 Product Roadmap · Last edited 2 hours ago ·</Text>
        <a
          style={{ color: cssVar.colorPrimary, cursor: 'pointer', fontSize: 14 }}
          onClick={() => setOpen(true)}
        >
          Preview
        </a>
      </Flexbox>

      <Modal
        open={open}
        title="Q1 Product Roadmap"
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flexbox gap={12}>
          <Text as="p" style={{ margin: 0, opacity: 0.65 }}>
            Key initiatives and milestones planned for Q1. All teams should align deliverables to
            the timelines specified below.
          </Text>
          {[
            'Ship new onboarding flow',
            'Integrate analytics dashboard',
            'Beta launch of AI assistant',
            'Public API v2 docs',
          ].map((item, i) => (
            <Flexbox horizontal align="center" gap={10} key={i}>
              <div
                style={{
                  background: cssVar.colorPrimary,
                  borderRadius: '50%',
                  flexShrink: 0,
                  height: 6,
                  opacity: 0.7,
                  width: 6,
                }}
              />
              <Text style={{ fontSize: 14 }}>{item}</Text>
            </Flexbox>
          ))}
        </Flexbox>
      </Modal>
    </>
  );
};

// ─── 2. Custom Footer：注册底部条款 checkbox ─────────────────────
const CustomFooterDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flexbox horizontal align="center" gap={8}>
        <input id="terms-check" type="checkbox" />
        <label htmlFor="terms-check" style={{ fontSize: 14, opacity: 0.75 }}>
          I agree to the{' '}
          <a
            style={{ color: cssVar.colorPrimary, cursor: 'pointer' }}
            onClick={() => setOpen(true)}
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            style={{ color: cssVar.colorPrimary, cursor: 'pointer' }}
            onClick={() => setOpen(true)}
          >
            Privacy Policy
          </a>
        </label>
      </Flexbox>

      <Modal
        okText="I Agree"
        open={open}
        title="Terms of Service"
        footer={(_, { OkBtn }) => (
          <>
            <Button onClick={() => setOpen(false)}>Decline</Button>
            <OkBtn />
          </>
        )}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flexbox gap={12}>
          {[
            'You must be at least 13 years old to use this service.',
            'You are responsible for maintaining the confidentiality of your account.',
            'We reserve the right to terminate accounts that violate our policies.',
            'All data is processed in accordance with our Privacy Policy.',
          ].map((clause, i) => (
            <Text as="p" key={i} style={{ fontSize: 13, margin: 0, opacity: 0.75 }}>
              {i + 1}. {clause}
            </Text>
          ))}
        </Flexbox>
      </Modal>
    </>
  );
};

// ─── 3. No Footer：可点击的发布公告 ─────────────────────────────
const NoFooterDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flexbox
        horizontal
        align="center"
        gap={10}
        style={{
          background: `color-mix(in srgb, ${cssVar.colorWarning} 10%, transparent)`,
          borderRadius: 8,
          cursor: 'pointer',
          padding: '8px 12px',
        }}
        onClick={() => setOpen(true)}
      >
        <span style={{ fontSize: 16 }}>🎉</span>
        <Text style={{ flex: 1, fontSize: 13 }}>
          <strong>What's new in v2.4</strong> — Draggable modals, fullscreen support & more
        </Text>
        <Tag color="orange" style={{ margin: 0 }}>
          New
        </Tag>
      </Flexbox>

      <Modal
        footer={false}
        open={open}
        title="Release Notes · v2.4.0"
        onCancel={() => setOpen(false)}
      >
        <Flexbox gap={16}>
          {[
            {
              color: 'green',
              label: 'New',
              text: 'Draggable modal with smooth spring animations.',
            },
            { color: 'green', label: 'New', text: 'Fullscreen toggle for large content modals.' },
            {
              color: 'blue',
              label: 'Improved',
              text: 'Footer render fn now exposes OkBtn and CancelBtn.',
            },
            {
              color: 'red',
              label: 'Fixed',
              text: 'Prevent scroll bleed-through when modal is open.',
            },
          ].map(({ label, color, text }, i) => (
            <Flexbox horizontal align="flex-start" gap={10} key={i}>
              <Tag color={color} style={{ flexShrink: 0, marginTop: 1 }}>
                {label}
              </Tag>
              <Text style={{ fontSize: 13 }}>{text}</Text>
            </Flexbox>
          ))}
        </Flexbox>
      </Modal>
    </>
  );
};

// ─── 4. Confirm Loading：表单提交按钮 ────────────────────────────
const ConfirmLoadingDemo = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <>
      <Flexbox
        gap={10}
        style={{
          background: cssVar.colorBgContainer,
          border: `1px solid ${cssVar.colorBorderSecondary}`,
          borderRadius: 10,
          padding: 14,
        }}
      >
        <Flexbox horizontal gap={8}>
          <input
            readOnly
            placeholder="Endpoint URL"
            value="https://api.example.com/v2/sync"
            style={{
              background: cssVar.colorFillTertiary,
              border: 'none',
              borderRadius: 6,
              color: cssVar.colorText,
              flex: 1,
              fontSize: 13,
              padding: '6px 10px',
            }}
          />
          <Button type="primary" onClick={() => setOpen(true)}>
            Sync now
          </Button>
        </Flexbox>
        <Text style={{ fontSize: 12, opacity: 0.45 }}>Last synced 3 minutes ago</Text>
      </Flexbox>

      <Modal
        confirmLoading={confirmLoading}
        okText="Start Sync"
        open={open}
        title="Sync to Cloud"
        onCancel={() => setOpen(false)}
        onOk={handleOk}
      >
        <Text as="p" style={{ margin: 0, opacity: 0.65 }}>
          This will upload all local changes to the cloud. Sync may take a few seconds. Click{' '}
          <strong>Start Sync</strong> to proceed.
        </Text>
      </Modal>
    </>
  );
};

// ─── 5. Draggable：代码编辑器顶部 action ─────────────────────────
const DraggableDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flexbox
        horizontal
        align="center"
        gap={0}
        style={{
          background: cssVar.colorFillTertiary,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {['index.ts', 'modal.tsx', 'style.ts'].map((tab, i) => (
          <div
            key={tab}
            style={{
              borderRight: `1px solid ${cssVar.colorBorderSecondary}`,
              fontSize: 12,
              opacity: i === 1 ? 1 : 0.5,
              padding: '6px 14px',
              background: i === 1 ? cssVar.colorBgContainer : 'transparent',
            }}
          >
            {tab}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <Button size="small" style={{ margin: '0 6px' }} type="link" onClick={() => setOpen(true)}>
          Refs
        </Button>
      </Flexbox>

      <Modal
        draggable
        open={open}
        title="Quick Reference"
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flexbox gap={8}>
          <Text style={{ fontSize: 12, opacity: 0.55 }}>
            Drag the title bar to reposition this modal freely.
          </Text>
          <pre
            style={{
              background: cssVar.colorFillTertiary,
              borderRadius: 8,
              fontSize: 12,
              margin: 0,
              padding: '12px 14px',
            }}
          >
            {`const { open, close } = useModal();\n\nopen(<MyContent />);`}
          </pre>
        </Flexbox>
      </Modal>
    </>
  );
};

export default () => (
  <Flexbox gap={14} padding={16} style={{ margin: '0 auto', maxWidth: 560 }}>
    <BasicModalDemo />
    <CustomFooterDemo />
    <NoFooterDemo />
    <ConfirmLoadingDemo />
    <DraggableDemo />
  </Flexbox>
);
