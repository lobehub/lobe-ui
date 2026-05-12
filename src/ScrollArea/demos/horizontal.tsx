import { ScrollArea } from '@lobehub/ui';

const tags = [
  'Vernacular',
  'Architecture',
  'Vitruvius',
  'De architectura',
  'Sustainable design',
  'Energy conscious',
  'Local traditions',
  'Cultural practices',
  'Folk building',
  'Indigenous design',
  'Climate-responsive',
  'Material literacy',
];

export default () => {
  return (
    <ScrollArea
      scrollFade="horizontal"
      scrollbarProps={{ orientation: 'horizontal' }}
      contentProps={{
        style: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
          padding: 16,
          width: 'max-content',
        },
      }}
      style={{
        height: 80,
        maxWidth: 'calc(100vw - 8rem)',
        width: '100%',
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            background: 'var(--lobe-color-fill-tertiary)',
            borderRadius: 999,
            color: 'var(--lobe-color-text-secondary)',
            flexShrink: 0,
            fontSize: 13,
            fontWeight: 500,
            padding: '6px 12px',
            whiteSpace: 'nowrap',
          }}
        >
          {tag}
        </span>
      ))}
    </ScrollArea>
  );
};
