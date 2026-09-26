import { Snippet } from '@lobehub/ui';
import { GithubIcon } from '@lobehub/ui/icons';
import { ArrowLeft, ArrowRight, ArrowUpRight, PencilLine } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { createDocumentLinks, findAdjacentDocuments } from '../../content/pageChrome';
import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import { PageEndActions } from '../Feedback/PageEndActions';
import { TableOfContents } from '../TableOfContents/TableOfContents';
import { NpmIcon } from './NpmIcon';
import { styles } from './style';

interface DocsLayoutProps {
  children: ReactNode;
  document: DocumentManifestEntry;
  navigation: NavigationSection[];
}

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;

export function DocsLayout({ children, document, navigation }: DocsLayoutProps) {
  const links = createDocumentLinks(document, siteConfig.themeConfig?.apiHeader);
  const { next, previous } = findAdjacentDocuments(navigation, document.pathname);

  return (
    <div className={styles.root} id="docs-content">
      <article data-pagefind-body className={styles.document}>
        <header className={styles.header}>
          <h1 data-pagefind-meta="title">{document.title}</h1>
          <p data-pagefind-meta="description">{document.description}</p>
          {links?.importStatement ? (
            <Snippet className={styles.importBlock} language="tsx">
              {links.importStatement}
            </Snippet>
          ) : null}
          {links ? (
            <div className={styles.links} data-pagefind-ignore="all">
              <a href={links.npmUrl} {...externalLinkProps}>
                <NpmIcon aria-hidden className={styles.linkIcon} />
                NPM
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
              </a>
              {links.sourceUrl ? (
                <a href={links.sourceUrl} {...externalLinkProps}>
                  <GithubIcon aria-hidden className={styles.linkIcon} size={13} strokeWidth={1.8} />
                  Source
                  <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
                </a>
              ) : null}
              {links.editUrl ? (
                <a href={links.editUrl} {...externalLinkProps}>
                  <PencilLine aria-hidden className={styles.linkIcon} size={13} strokeWidth={1.8} />
                  Edit
                  <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
                </a>
              ) : null}
            </div>
          ) : null}
          <div className={styles.searchMetadata}>
            {document.category ? (
              <span data-pagefind-meta="category">{document.category}</span>
            ) : null}
            {document.status ? <span data-pagefind-meta="status">{document.status}</span> : null}
          </div>
        </header>
        <div className={styles.content} id="docs-page-content">
          {children}
        </div>
        {previous || next ? (
          <nav aria-label="Adjacent documents" className={styles.pagination}>
            {previous ? (
              <Link className={styles.paginationLink} rel="prev" to={previous.pathname}>
                <ArrowLeft
                  aria-hidden
                  className={styles.paginationArrow}
                  size={16}
                  strokeWidth={1.8}
                />
                <span className={styles.paginationText}>
                  <span>Previous</span>
                  <strong>{previous.title}</strong>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                className={`${styles.paginationLink} ${styles.paginationLinkNext}`}
                rel="next"
                to={next.pathname}
              >
                <span className={styles.paginationText}>
                  <span>Next</span>
                  <strong>{next.title}</strong>
                </span>
                <ArrowRight
                  aria-hidden
                  className={styles.paginationArrow}
                  size={16}
                  strokeWidth={1.8}
                />
              </Link>
            ) : null}
          </nav>
        ) : null}
        <PageEndActions pathname={document.pathname} />
      </article>

      <TableOfContents contentId="docs-page-content" scopeKey={document.pathname} />
    </div>
  );
}
