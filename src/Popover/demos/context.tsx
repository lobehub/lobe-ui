import { Button, Flexbox, Popover, Tag, usePopoverContext } from '@lobehub/ui';
import { Check, Code2, X } from 'lucide-react';

const Content = () => {
  const { close } = usePopoverContext();
  return (
    <Flexbox gap={16} style={{ padding: '12px 16px', width: 320 }}>
      <Flexbox gap={10}>
        <Flexbox align="center" gap={8} horizontal>
          <Flexbox
            align="center"
            justify="center"
            style={{
              background: 'var(--lobe-color-success-bg)',
              borderRadius: 8,
              height: 36,
              width: 36,
            }}
          >
            <Code2 size={18} style={{ color: 'var(--lobe-color-success)' }} />
          </Flexbox>
          <Flexbox flex={1} gap={4}>
            <Flexbox align="center" gap={6} horizontal>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Context API</div>
              <Tag color="green">Recommended</Tag>
            </Flexbox>
          </Flexbox>
        </Flexbox>
        <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13, lineHeight: 1.7 }}>
          Access popover controls from within the content component. Close imperatively without
          managing external state.
        </div>
      </Flexbox>

      <Flexbox
        gap={6}
        style={{
          background: 'var(--lobe-color-fill-tertiary)',
          borderRadius: 8,
          fontSize: 12,
          fontFamily: 'monospace',
          padding: 12,
        }}
      >
        <div style={{ color: 'var(--lobe-color-text-3)' }}>const {'{ close }'} = usePopoverContext();</div>
      </Flexbox>

      <Flexbox gap={8} horizontal justify="flex-end">
        <Button onClick={close} size="small" type="text">
          Cancel
        </Button>
        <Button icon={<Check size={16} />} onClick={close} size="small" type="primary">
          Got it
        </Button>
      </Flexbox>
    </Flexbox>
  );
};

export default () => {
  return (
    <Flexbox align="center" justify="center" style={{ padding: 48 }}>
      <Popover content={<Content />} placement="bottom" trigger="click">
        <Button icon={<Code2 size={18} />} size="large" type="primary">
          Show Context Demo
        </Button>
      </Popover>
    </Flexbox>
  );
};
