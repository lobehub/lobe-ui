import './DocsLayout.css';

import type { ReactNode } from 'react';

import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import LazyGiscus from '../Feedback/LazyGiscus';
import PageHelpful from '../Feedback/PageHelpful';
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
          <h1 data-pagefind-meta="title">{document.title}</h1>
          <p data-pagefind-meta="description">{document.description}</p>
          <div className="docs-layout__search-metadata">
            {document.category ? (
              <span data-pagefind-meta="category">{document.category}</span>
            ) : null}
            {document.status ? <span data-pagefind-meta="status">{document.status}</span> : null}
          </div>
        </header>
        <div className="docs-layout__content" id="docs-page-content">
          {children}
        </div>
        <PageHelpful pathname={document.pathname} />
        <LazyGiscus pathname={document.pathname} />
      </article>

      <TableOfContents contentId="docs-page-content" scopeKey={document.pathname} />
    </main>
  );
}
