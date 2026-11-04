import { Flexbox, Toc } from '@lobehub/ui';
import { useRef } from 'react';

const sections = [
  {
    id: 'introduction',
    level: 2 as const,
    title: 'Introduction',
    body: 'The Toc component provides a table of contents with an animated SVG outline rail that bends between different heading levels as you scroll.',
  },
  {
    id: 'getting-started',
    level: 2 as const,
    title: 'Getting Started',
    body: 'Follow these steps to wire Toc into a documentation layout. The rail and scroll spy need a scrollable container tall enough to move through several headings.',
  },
  {
    id: 'installation',
    level: 3 as const,
    title: 'Installation',
    body: 'Install the package with your preferred package manager, then import Toc from @lobehub/ui. Prefer the dedicated CSS entry when you tree-shake styles.',
  },
  {
    id: 'configuration',
    level: 3 as const,
    title: 'Configuration',
    body: 'Pass a flat TocItem list or an Anchor-compatible tree. Set getContainer to the element that actually scrolls, and tune offset for sticky headers.',
  },
  {
    id: 'usage',
    level: 2 as const,
    title: 'Usage',
    body: 'Place the article and the Toc side by side. As headings cross the offset line, the SVG highlight stroke moves to the active item.',
  },
  {
    id: 'basic-example',
    level: 3 as const,
    title: 'Basic Example',
    body: 'A short paragraph under each heading is enough for the demo, as long as every section has enough height for scroll spy to resolve clearly.',
  },
  {
    id: 'nested-headings',
    level: 3 as const,
    title: 'Nested Headings',
    body: 'When an h3 is active, its parent h2 stays marked so the outline stays readable. Nested bends in the SVG rail follow those level changes.',
  },
  {
    id: 'advanced-features',
    level: 2 as const,
    title: 'Advanced Features',
    body: 'Click a link to smooth-scroll (instant under reduced motion). Call event.preventDefault in onClick if you own navigation yourself.',
  },
  {
    id: 'scroll-spy',
    level: 3 as const,
    title: 'Scroll Spy',
    body: 'The active item is the last target whose top has passed the offset. Keep scrolling this column to watch the rail catch up section by section.',
  },
  {
    id: 'customization',
    level: 3 as const,
    title: 'Customization',
    body: 'Override public class names for spacing and type. The rail geometry is derived from item levels, so nested content keeps producing visible bends.',
  },
];

export default () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = sections.map(({ id, level, title }) => ({
    href: `#${id}`,
    level,
    title,
  }));

  return (
    <Flexbox horizontal gap={24} padding={16} style={{ height: 420 }}>
      <div
        ref={scrollRef}
        style={{ flex: 1, maxWidth: 600, overflow: 'auto', paddingInlineEnd: 8 }}
      >
        {sections.map(({ id, level, title, body }) => (
          <section id={id} key={id} style={{ minHeight: 220, paddingBlockEnd: 24 }}>
            {level === 2 ? (
              <h2 style={{ marginBlockStart: 0 }}>{title}</h2>
            ) : (
              <h3 style={{ marginBlockStart: 0 }}>{title}</h3>
            )}
            <p>{body}</p>
            <p>
              Extra copy keeps the column scrollable so the SVG outline rail and scroll spy stay
              easy to verify in the docs demo.
            </p>
          </section>
        ))}
      </div>
      <Toc getContainer={() => scrollRef.current} items={items} offset={8} style={{ width: 200 }} />
    </Flexbox>
  );
};
