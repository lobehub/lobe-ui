import { Flexbox } from '@lobehub/ui';
import { Anchor, type AnchorItem } from '@lobehub/ui';
import { useRef } from 'react';

const sections = [
  { id: 'anchor-overview', title: 'Overview' },
  { id: 'anchor-install', title: 'Installation' },
  { id: 'anchor-install-pnpm', title: 'Using pnpm', parent: 'anchor-install' },
  { id: 'anchor-install-bun', title: 'Using bun', parent: 'anchor-install' },
  { id: 'anchor-usage', title: 'Usage with a very long heading that wraps onto a second line' },
  { id: 'anchor-faq', title: 'FAQ' },
];

const items: AnchorItem[] = sections
  .filter((section) => !section.parent)
  .map(({ id, title }) => ({
    children: sections
      .filter((section) => section.parent === id)
      .map((child) => ({ href: `#${child.id}`, key: child.id, title: child.title })),
    href: `#${id}`,
    key: id,
    title,
  }));

export default () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Flexbox horizontal gap={24} padding={16} style={{ height: 360 }}>
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto' }}>
        {sections.map(({ id, title, parent }) => (
          <section id={id} key={id} style={{ minHeight: 240 }}>
            {parent ? (
              <h3 style={{ marginBlockStart: 0 }}>{title}</h3>
            ) : (
              <h2 style={{ marginBlockStart: 0 }}>{title}</h2>
            )}
            <p>Scroll the content and the table of contents follows along.</p>
          </section>
        ))}
      </div>
      <Anchor
        aria-label="On this page"
        getContainer={() => scrollRef.current}
        items={items}
        offset={8}
        style={{ width: 200 }}
      />
    </Flexbox>
  );
};
