import './TableOfContents.css';

import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  contentId: string;
  scopeKey: string;
}

interface TableOfContentsItem {
  id: string;
  level: 2 | 3;
  title: string;
}

export default function TableOfContents({ contentId, scopeKey }: TableOfContentsProps) {
  const [items, setItems] = useState<TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) {
      setItems([]);
      return;
    }

    const headings = Array.from(content.querySelectorAll<HTMLHeadingElement>('h2, h3'));
    const nextItems = headings.flatMap((heading) => {
      const title = heading.textContent?.trim();
      if (!title || !heading.id) return [];

      return [
        {
          id: heading.id,
          level: heading.tagName === 'H3' ? 3 : 2,
          title,
        } satisfies TableOfContentsItem,
      ];
    });
    setItems(nextItems);
    setActiveId(nextItems[0]?.id);
  }, [contentId, scopeKey]);

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const headings = items.flatMap((item) => {
      const heading = document.getElementById(item.id);
      return heading ? [heading] : [];
    });
    if (headings.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = headings.find((heading) => visible.has(heading.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: '-96px 0px -66% 0px' },
    );
    for (const heading of headings) observer.observe(heading);

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="docs-toc">
      <nav aria-label="On this page">
        <h2>On this page</h2>
        <ol>
          {items.map((item) => (
            <li data-level={item.level} key={item.id}>
              <a
                aria-current={item.id === activeId ? 'location' : undefined}
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
