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
