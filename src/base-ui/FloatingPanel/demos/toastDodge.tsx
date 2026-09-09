import { Flexbox, Text, toast, ToastHost } from '@lobehub/ui';
import { Button, FloatingPanel } from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';
import { Bell, MessageCirclePlus } from 'lucide-react';
import { useState } from 'react';

// Widths are viewport-relative so each case reaches the same verdict at any
// window size: a fixed width flips back to a left shift on a wide screen.
const CASES = {
  above: {
    height: 320,
    hint: 'No lane wide enough, but the panel is short, so the toast rides above it.',
    label: 'Above',
    width: 'calc(100vw - 340px)',
  },
  left: {
    height: 'min(640px, calc(100dvh - 16px))',
    hint: 'A full lane is free beside the panel, so the toast keeps its bottom baseline.',
    label: 'Left lane',
    width: 640,
  },
  narrowed: {
    height: 'calc(100dvh - 16px)',
    hint: 'The lane is under 360px but still over 260px, so the toast narrows to fit it.',
    label: 'Narrowed',
    width: 'calc(100vw - 320px)',
  },
  yields: {
    height: 'calc(100dvh - 16px)',
    hint: 'Nothing is left on either axis, so the panel lifts its own bottom edge instead.',
    label: 'Panel yields',
    width: 'calc(100vw - 200px)',
  },
} as const;

type CaseKey = keyof typeof CASES;

const ORDER: CaseKey[] = ['left', 'above', 'narrowed', 'yields'];

const Demo = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<CaseKey>('left');

  const notify = () =>
    toast.success({
      description: 'Switch cases or resize the window to watch the toast pick a lane.',
      duration: 60_000,
      title: 'Run finished',
    });

  return (
    <Flexbox gap={16}>
      <ToastHost />
      <Flexbox gap={4}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>Toast dodging</Text>
        <Text type="secondary">
          A bottom-right panel pushes the bottom-right toast viewport out of its way, and the toast
          slides back when the panel closes. Every case keeps a 12px gutter.
        </Text>
      </Flexbox>
      <Flexbox horizontal gap={8} wrap="wrap">
        <Button icon={<MessageCirclePlus size={16} />} type="primary" onClick={() => setOpen(true)}>
          Open panel
        </Button>
        <Button icon={<Bell size={16} />} onClick={notify}>
          Show toast
        </Button>
        {ORDER.map((key) => (
          <Button
            key={key}
            type={active === key ? 'primary' : 'default'}
            onClick={() => setActive(key)}
          >
            {CASES[key].label}
          </Button>
        ))}
      </Flexbox>
      <Text type="secondary">{CASES[active].hint}</Text>
      <FloatingPanel
        footer={<Button block>Send follow up message</Button>}
        height={CASES[active].height}
        maskClosable={false}
        minHeight={260}
        minWidth={320}
        open={open}
        title={`${CASES[active].label} panel`}
        width={CASES[active].width}
        styles={{
          body: { padding: 16 },
          panel: { background: cssVar.colorBgContainer },
        }}
        onOpenChange={setOpen}
      >
        <Flexbox gap={12}>
          <Text strong>Urgent pending</Text>
          <Text type="secondary">
            Toasts fired while this panel is open never land inside it. The panel writes its
            measured geometry to CSS variables the toast viewport reads.
          </Text>
        </Flexbox>
      </FloatingPanel>
    </Flexbox>
  );
};

export default Demo;
