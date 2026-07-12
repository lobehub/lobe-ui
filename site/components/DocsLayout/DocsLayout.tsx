import './DocsLayout.css';

import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import {
  createDocumentLinks,
  findAdjacentDocuments,
  findSectionByPathname,
} from '../../content/pageChrome';
import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import CopyControl from '../CopyControl/CopyControl';
import LazyGiscus from '../Feedback/LazyGiscus';
import PageHelpful from '../Feedback/PageHelpful';
import Sidebar from '../Sidebar/Sidebar';
import TableOfContents from '../TableOfContents/TableOfContents';

interface DocsLayoutProps {
  children: ReactNode;
  document: DocumentManifestEntry;
  navigation: NavigationSection[];
}

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;

export default function DocsLayout({ children, document, navigation }: DocsLayoutProps) {
  const section = findSectionByPathname(navigation, document.pathname);
  const links = createDocumentLinks(document);
  const { next, previous } = findAdjacentDocuments(navigation, document.pathname);

  return (
    <main className="docs-layout" data-sidebar={section ? 'true' : 'false'} id="docs-content">
      {section ? (
        <aside className="docs-layout__sidebar">
          <Sidebar navigation={navigation} section={section} />
        </aside>
      ) : null}

      <article data-pagefind-body className="docs-layout__document">
        <header className="docs-layout__header">
          <h1 data-pagefind-meta="title">{document.title}</h1>
          <p data-pagefind-meta="description">{document.description}</p>
          {links?.importStatement ? (
            <div className="docs-layout__import">
              <code>{links.importStatement}</code>
              <CopyControl label="Copy import statement" value={links.importStatement} />
            </div>
          ) : null}
          {links ? (
            <div className="docs-layout__links" data-pagefind-ignore="all">
              <a href={links.npmUrl} {...externalLinkProps}>
                NPM
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
              </a>
              <a href={links.sourceUrl} {...externalLinkProps}>
                Source
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
              </a>
              <a href={links.editUrl} {...externalLinkProps}>
                Edit
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
              </a>
            </div>
          ) : null}
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
        {previous || next ? (
          <nav aria-label="Adjacent documents" className="docs-layout__pagination">
            {previous ? (
              <Link className="docs-layout__pagination-link" rel="prev" to={previous.pathname}>
                <span>Previous</span>
                <strong>{previous.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                className="docs-layout__pagination-link docs-layout__pagination-link--next"
                rel="next"
                to={next.pathname}
              >
                <span>Next</span>
                <strong>{next.title}</strong>
              </Link>
            ) : null}
          </nav>
        ) : null}
        <PageHelpful pathname={document.pathname} />
        <LazyGiscus pathname={document.pathname} />
      </article>

      <TableOfContents contentId="docs-page-content" scopeKey={document.pathname} />
    </main>
  );
}
