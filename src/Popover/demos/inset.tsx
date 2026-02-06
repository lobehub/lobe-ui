import { Button, Flexbox, Popover, Tag } from '@lobehub/ui';
import { ArrowUpRight, Frame, X } from 'lucide-react';

export default () => {
  return (
    <Flexbox horizontal align="center" gap={32} justify="center" style={{ padding: 48 }}>
      <Flexbox align="center" gap={12}>
        <Popover
          placement="bottom"
          content={
            <Flexbox gap={8} style={{ padding: '8px 12px' }}>
              <Flexbox horizontal align="center" gap={6}>
                <ArrowUpRight size={16} style={{ color: 'var(--lobe-color-primary)' }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Normal Popover</div>
              </Flexbox>
              <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
                Standard popover with arrow indicator
              </div>
            </Flexbox>
          }
        >
          <Button size="large">With Arrow</Button>
        </Popover>
        <Tag color="blue">Default</Tag>
      </Flexbox>

      <Flexbox align="center" gap={12}>
        <Popover
          arrow={false}
          placement="bottom"
          content={
            <Flexbox gap={8} style={{ padding: '8px 12px' }}>
              <Flexbox horizontal align="center" gap={6}>
                <X size={16} style={{ color: 'var(--lobe-color-text-2)' }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>No Arrow</div>
              </Flexbox>
              <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
                Clean popover without arrow
              </div>
            </Flexbox>
          }
        >
          <Button size="large">No Arrow</Button>
        </Popover>
        <Tag color="gray">Minimal</Tag>
      </Flexbox>

      <Flexbox align="center" gap={12}>
        <Popover
          inset
          placement="bottom"
          content={
            <Flexbox gap={8} style={{ padding: '8px 12px' }}>
              <Flexbox horizontal align="center" gap={6}>
                <Frame size={16} style={{ color: 'var(--lobe-color-success)' }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Inset Mode</div>
              </Flexbox>
              <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
                Popover renders inside trigger bounds
              </div>
            </Flexbox>
          }
        >
          <Button size="large" type="primary">
            Inset
          </Button>
        </Popover>
        <Tag color="purple">Special</Tag>
      </Flexbox>
    </Flexbox>
  );
};
