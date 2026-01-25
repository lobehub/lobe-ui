import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  CopyButton,
  Flexbox,
  FluentEmoji,
  Icon,
  Popover,
  Tag,
  Text,
} from '@lobehub/ui';
import { GradientButton } from '@lobehub/ui/awesome';
import { Heart, Settings, Star } from 'lucide-react';

const PopoverContent = ({ title }: { title: string }) => (
  <Flexbox gap={8} style={{ padding: 12, width: 200 }}>
    <Text style={{ fontWeight: 600 }}>{title}</Text>
    <Text style={{ color: 'var(--lobe-color-text-3)', fontSize: 13 }}>
      This popover was triggered by the component above.
    </Text>
  </Flexbox>
);

const Section = ({
  title,
  description,
  children,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) => (
  <Flexbox gap={12}>
    <Flexbox gap={4}>
      <Text style={{ fontSize: 15, fontWeight: 600 }}>{title}</Text>
      <Text style={{ color: 'var(--lobe-color-text-3)', fontSize: 13 }}>{description}</Text>
    </Flexbox>
    <Flexbox gap={12} horizontal wrap="wrap">
      {children}
    </Flexbox>
  </Flexbox>
);

export default () => {
  return (
    <Flexbox gap={32} style={{ padding: 24 }}>
      <Flexbox gap={8}>
        <Text style={{ fontSize: 20, fontWeight: 700 }}>Native Button Auto Detection</Text>
        <Text style={{ color: 'var(--lobe-color-text-3)', fontSize: 14 }}>
          Demonstrates automatic nativeButton prop resolution based on component type. No manual
          nativeButton prop is passed - all detection is automatic.
        </Text>
      </Flexbox>

      <Section
        description="Components that render native <button> elements (nativeButton=true)"
        title="Native Button Components"
      >
        <Popover content={<PopoverContent title="Button Trigger" />} trigger="click">
          <Button icon={<Star size={16} />}>Button</Button>
        </Popover>

        <Popover content={<PopoverContent title="GradientButton Trigger" />} trigger="click">
          <GradientButton>GradientButton</GradientButton>
        </Popover>
      </Section>

      <Section
        description="Components that render non-button elements (nativeButton=false)"
        title="Non-Button Components"
      >
        <Popover content={<PopoverContent title="ActionIcon Trigger" />} trigger="click">
          <ActionIcon icon={Settings} size="large" title="ActionIcon" />
        </Popover>

        <Popover content={<PopoverContent title="CopyButton Trigger" />} trigger="click">
          <CopyButton content="Copied text" size="large" />
        </Popover>

        <Popover content={<PopoverContent title="Avatar Trigger" />} trigger="click">
          <Avatar
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=test"
            size={40}
            style={{ cursor: 'pointer' }}
          />
        </Popover>

        <Popover content={<PopoverContent title="Icon Trigger" />} trigger="click">
          <Icon icon={Heart} size="large" style={{ cursor: 'pointer' }} />
        </Popover>

        <Popover content={<PopoverContent title="FluentEmoji Trigger" />} trigger="click">
          <FluentEmoji emoji="🎉" size={32} style={{ cursor: 'pointer' }} />
        </Popover>

        <Popover content={<PopoverContent title="Tag Trigger" />} trigger="click">
          <Tag color="blue" style={{ cursor: 'pointer' }}>
            Click me
          </Tag>
        </Popover>

        <Popover content={<PopoverContent title="Text Trigger" />} trigger="click">
          <Text style={{ cursor: 'pointer', textDecoration: 'underline' }}>Text Link</Text>
        </Popover>

        <Popover content={<PopoverContent title="Flexbox Trigger" />} trigger="click">
          <Flexbox
            align="center"
            gap={8}
            horizontal
            style={{
              background: 'var(--lobe-color-fill-tertiary)',
              borderRadius: 8,
              cursor: 'pointer',
              padding: '8px 16px',
            }}
          >
            <Icon icon={Star} />
            <span>Flexbox</span>
          </Flexbox>
        </Popover>

        <Popover content={<PopoverContent title="Center Trigger" />} trigger="click">
          <Center
            style={{
              background: 'var(--lobe-color-fill-tertiary)',
              borderRadius: 8,
              cursor: 'pointer',
              height: 40,
              width: 80,
            }}
          >
            Center
          </Center>
        </Popover>
      </Section>

      <Section
        description="Native HTML elements are also detected automatically"
        title="Native HTML Elements"
      >
        <Popover content={<PopoverContent title="Native button Trigger" />} trigger="click">
          <button style={{ cursor: 'pointer', padding: '8px 16px' }} type="button">
            Native button
          </button>
        </Popover>

        <Popover content={<PopoverContent title="div Trigger" />} trigger="click">
          <div
            style={{
              background: 'var(--lobe-color-fill-tertiary)',
              borderRadius: 8,
              cursor: 'pointer',
              padding: '8px 16px',
            }}
          >
            div element
          </div>
        </Popover>

        <Popover content={<PopoverContent title="span Trigger" />} trigger="click">
          <span
            style={{
              background: 'var(--lobe-color-fill-tertiary)',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'inline-block',
              padding: '8px 16px',
            }}
          >
            span element
          </span>
        </Popover>
      </Section>
    </Flexbox>
  );
};
