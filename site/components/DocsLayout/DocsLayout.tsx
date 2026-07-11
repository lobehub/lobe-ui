import './DocsLayout.css';

import type { ReactNode } from 'react';

import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import Sidebar from '../Sidebar/Sidebar';
import TableOfContents from '../TableOfContents/TableOfContents';

interface DocsLayoutProps {
  children: ReactNode;
  document: DocumentManifestEntry;
  navigation: NavigationSection[];
}

export default function DocsLayout({ children, document, navigation }: DocsLayoutProps) {
  return (
    <main className="docs-layout" id="docs-content">
      <aside className="docs-layout__sidebar">
        <Sidebar navigation={navigation} />
      </aside>

      <article data-pagefind-body className="docs-layout__document">
        <header className="docs-layout__header">
          <h1>{document.title}</h1>
          <p>{document.description}</p>
        </header>
        <div className="docs-layout__content" id="docs-page-content">
          {children}
        </div>
      </article>

      <TableOfContents contentId="docs-page-content" scopeKey={document.pathname} />
    </main>
  );
}
