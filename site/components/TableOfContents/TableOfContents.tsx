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

const toSlug = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase('en')
    .replaceAll(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replaceAll(/(^-|-$)/g, '') || 'section';

export default function TableOfContents({ contentId, scopeKey }: TableOfContentsProps) {
  const [items, setItems] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) {
      setItems([]);
      return;
    }

    const usedIds = new Set<string>();
    const nextItems = Array.from(content.querySelectorAll<HTMLHeadingElement>('h2, h3')).flatMap(
      (heading) => {
        const title = heading.textContent?.trim();
        if (!title) return [];

        const baseId = heading.id || toSlug(title);
        let id = baseId;
        let suffix = 2;
        while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
        usedIds.add(id);
        heading.id = id;

        return [
          { id, level: heading.tagName === 'H3' ? 3 : 2, title } satisfies TableOfContentsItem,
        ];
      },
    );
    setItems(nextItems);
  }, [contentId, scopeKey]);

  if (items.length === 0) return null;

  return (
    <aside className="docs-toc">
      <nav aria-label="On this page">
        <h2>On this page</h2>
        <ol>
          {items.map((item) => (
            <li data-level={item.level} key={item.id}>
              <a href={`#${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
