import { ScrollArea } from '@lobehub/ui';

const blocks = [
  {
    accent: 'linear-gradient(135deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.1))',
    bg: 'rgba(255, 255, 255, 0.55)',
    desc: 'A translucent block — the fade should reveal the gradient behind, not a fixed background color.',
    title: 'Glass / Light',
  },
  {
    accent: 'linear-gradient(135deg, rgba(34, 197, 94, 0.55), rgba(34, 197, 94, 0.1))',
    bg: 'rgba(34, 197, 94, 0.16)',
    desc: 'Different block color. The mask fade remains consistent.',
    title: 'Mint',
  },
  {
    accent: 'linear-gradient(135deg, rgba(59, 130, 246, 0.55), rgba(59, 130, 246, 0.1))',
    bg: 'rgba(59, 130, 246, 0.16)',
    desc: 'Scroll a bit — the top fade ramps in, bottom ramps out near the end.',
    title: 'Azure',
  },
  {
    accent: 'linear-gradient(135deg, rgba(236, 72, 153, 0.55), rgba(236, 72, 153, 0.1))',
    bg: 'rgba(236, 72, 153, 0.16)',
    desc: 'Every block has its own tint; the background stays a multi-stop gradient.',
    title: 'Rose',
  },
  {
    accent: 'linear-gradient(135deg, rgba(245, 158, 11, 0.55), rgba(245, 158, 11, 0.1))',
    bg: 'rgba(245, 158, 11, 0.16)',
    desc: 'This demo highlights that the scroll fade is a mask on content, not an overlay gradient.',
    title: 'Amber',
  },
];

export default () => {
  return (
    <ScrollArea
      contentProps={{ style: { padding: 16 } }}
      scrollFade
      style={{
        background:
          'radial-gradient(1200px 240px at 20% 0%, rgba(59, 130, 246, 0.28), transparent 55%), radial-gradient(900px 240px at 85% 10%, rgba(236, 72, 153, 0.22), transparent 50%), linear-gradient(135deg, rgba(16, 24, 40, 0.05), rgba(16, 24, 40, 0.02))',
        height: 280,
        maxWidth: 'calc(100vw - 8rem)',
        width: '100%',
      }}
      viewportProps={{
        // Make the viewport background transparent so the root gradient is visible.
        style: { background: 'transparent' },
      }}
    >
      {blocks.map((item) => (
        <section
          key={item.title}
          style={{
            background: item.bg,
            border: '1px solid rgba(16, 24, 40, 0.06)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: item.accent,
              borderBottom: '1px solid rgba(16, 24, 40, 0.06)',
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
          </div>
          <p style={{ color: 'var(--lobe-color-text-secondary)', margin: 0, padding: 12 }}>
            {item.desc}
          </p>
        </section>
      ))}
    </ScrollArea>
  );
};
