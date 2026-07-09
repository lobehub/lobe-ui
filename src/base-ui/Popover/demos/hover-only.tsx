import { Button, Flexbox, Popover, Tag, Text } from '@lobehub/ui';
import { MousePointerClick, Move, Pointer } from 'lucide-react';
import { type ElementType, useState } from 'react';

const Step = ({ icon: Icon, label }: { icon: ElementType; label: string }) => (
  <Flexbox horizontal align="center" gap={8}>
    <Icon size={14} style={{ color: 'var(--lobe-color-text-3)', flexShrink: 0 }} />
    <Text style={{ color: 'var(--lobe-color-text-2)', fontSize: 13 }}>{label}</Text>
  </Flexbox>
);

export default () => {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <Flexbox gap={24} style={{ padding: 32 }}>
      <Flexbox gap={8}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>Hover-only does not pin on click</Text>
        <Text style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
          With <code>trigger=&quot;hover&quot;</code>, open via hover, then click the trigger. The
          card must stay hover-driven: leave the trigger and it closes. It must not stick open until
          an outside click.
        </Text>
      </Flexbox>

      <Flexbox gap={10}>
        <Step icon={Pointer} label="1. Hover the button — card opens" />
        <Step icon={MousePointerClick} label="2. Click the button — card must not pin" />
        <Step icon={Move} label="3. Move the pointer away — card closes" />
      </Flexbox>

      <Flexbox horizontal align="center" gap={16} wrap="wrap">
        <Popover
          arrow={false}
          mouseEnterDelay={0.15}
          mouseLeaveDelay={0.1}
          placement="right"
          trigger="hover"
          content={
            <Flexbox gap={8} style={{ padding: 12, width: 220 }}>
              <Text style={{ fontWeight: 600 }}>Meta card</Text>
              <Text style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, lineHeight: 1.5 }}>
                Hover-only content. Clicking the trigger must not disable mouseleave dismiss.
              </Text>
              <Tag color={hoverOpen ? 'green' : 'default'}>
                {hoverOpen ? 'open (hover)' : 'closed'}
              </Tag>
            </Flexbox>
          }
          onOpenChange={setHoverOpen}
        >
          <Button size="large" type="primary" onClick={() => setClickCount((n) => n + 1)}>
            Hover then click me
          </Button>
        </Popover>

        <Flexbox gap={6}>
          <Flexbox horizontal align="center" gap={8}>
            <Text style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>open</Text>
            <Tag color={hoverOpen ? 'green' : 'default'}>{String(hoverOpen)}</Tag>
          </Flexbox>
          <Flexbox horizontal align="center" gap={8}>
            <Text style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>trigger clicks</Text>
            <Tag>{clickCount}</Tag>
          </Flexbox>
        </Flexbox>
      </Flexbox>

      <Flexbox
        gap={8}
        style={{
          background: 'var(--lobe-color-fill-tertiary)',
          borderRadius: 10,
          padding: '12px 14px',
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: 600 }}>Expected</Text>
        <Text style={{ color: 'var(--lobe-color-text-2)', fontSize: 12, lineHeight: 1.6 }}>
          After click while open, <code>open</code> stays <code>true</code> only while the pointer
          remains over the trigger. Leaving sets <code>open</code> to <code>false</code> without
          requiring a second click elsewhere.
        </Text>
      </Flexbox>
    </Flexbox>
  );
};
