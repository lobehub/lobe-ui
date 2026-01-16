import { Flexbox, Icon, LobeSelect, Tag } from '@lobehub/ui';
import { Palette, Sparkles, Zap } from 'lucide-react';
import { useMemo } from 'react';

const toneOptions = [
  { label: 'Aurora', value: 'aurora' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Neon', value: 'neon' },
];

const toneMeta = {
  aurora: {
    badge: 'Popular',
    color: '#52c41a',
    description: 'Soft gradient with calm vibes',
    icon: Sparkles,
  },
  neon: {
    badge: 'Bold',
    color: '#722ed1',
    description: 'High contrast neon highlights',
    icon: Zap,
  },
  pulse: {
    badge: 'Fresh',
    color: '#1677ff',
    description: 'Clean accents with subtle glow',
    icon: Palette,
  },
} as const;

export default () => {
  const labelMap = useMemo(
    () =>
      toneOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label as string;
        return acc;
      }, {}),
    [],
  );

  return (
    <Flexbox
      align="center"
      gap={12}
      justify="center"
      style={{
        background: 'var(--lobe-color-fill-secondary)',
        borderRadius: 16,
        padding: 28,
      }}
    >
      <Flexbox align="center" gap={8} horizontal>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Custom Render</div>
        <Tag color="gold">optionRender</Tag>
        <Tag color="cyan">labelRender</Tag>
      </Flexbox>
      <LobeSelect
        allowClear
        labelRender={(option) => {
          const meta = toneMeta[option.value as keyof typeof toneMeta];
          return (
            <Flexbox align="center" gap={6} horizontal>
              <span
                style={{
                  background: meta.color,
                  borderRadius: 999,
                  height: 8,
                  width: 8,
                }}
              />
              <span>{labelMap[option.value as keyof typeof labelMap] ?? option.label}</span>
            </Flexbox>
          );
        }}
        optionRender={(option) => {
          const meta = toneMeta[option.value as keyof typeof toneMeta];
          return (
            <Flexbox align="center" gap={10} horizontal style={{ width: '100%' }}>
              <Icon icon={meta.icon} size={16} />
              <Flexbox gap={2}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{option.label}</div>
                <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 11 }}>
                  {meta.description}
                </div>
              </Flexbox>
              <div style={{ marginLeft: 'auto' }}>
                <Tag color="blue">{meta.badge}</Tag>
              </div>
            </Flexbox>
          );
        }}
        options={toneOptions}
        placeholder="Pick a visual tone"
        popupMatchSelectWidth={false}
        prefix={Palette}
        style={{ width: 320 }}
        suffixIcon={Sparkles}
      />
      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, textAlign: 'center' }}>
        Render rich labels in the list and compact chips in the trigger.
      </div>
    </Flexbox>
  );
};
