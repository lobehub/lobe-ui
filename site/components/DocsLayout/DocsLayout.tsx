import { GithubIcon } from '@lobehub/ui/icons/lucideExtra';
import { ArrowUpRight, PencilLine } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import {
  createDocumentLinks,
  findAdjacentDocuments,
  findSectionByPathname,
} from '../../content/pageChrome';
import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import CopyControl from '../CopyControl/CopyControl';
import PageEndActions from '../Feedback/PageEndActions';
import Sidebar from '../Sidebar/Sidebar';
import TableOfContents from '../TableOfContents/TableOfContents';
import NpmIcon from './NpmIcon';
import { styles } from './style';

interface DocsLayoutProps {
  children: ReactNode;
  document: DocumentManifestEntry;
  navigation: NavigationSection[];
}

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;
const importStatementPattern = /^(import)\s+(\{)\s*([A-Za-z0-9_]+)\s*(\})\s+(from)\s+('[^']+')(;)$/;

function HighlightedImport({ value }: { value: string }) {
  const match = importStatementPattern.exec(value);
  if (!match) return <code>{value}</code>;

  const [, keywordImport, openBrace, identifier, closeBrace, keywordFrom, packageLiteral, semi] =
    match;

  return (
    <code>
      <span className={styles.syntaxKeyword}>{keywordImport}</span>{' '}
      <span className={styles.syntaxPunctuation}>{openBrace}</span>{' '}
      <span className={styles.syntaxEntity}>{identifier}</span>{' '}
      <span className={styles.syntaxPunctuation}>{closeBrace}</span>{' '}
      <span className={styles.syntaxKeyword}>{keywordFrom}</span>{' '}
      <span className={styles.syntaxString}>{packageLiteral}</span>
      <span className={styles.syntaxPunctuation}>{semi}</span>
    </code>
  );
}

export default function DocsLayout({ children, document, navigation }: DocsLayoutProps) {
  const section = findSectionByPathname(navigation, document.pathname);
  const links = createDocumentLinks(document);
  const { next, previous } = findAdjacentDocuments(navigation, document.pathname);

  return (
    <main className={styles.root} data-sidebar={section ? 'true' : 'false'} id="docs-content">
      {section ? (
        <aside className={styles.sidebar}>
          <Sidebar navigation={navigation} section={section} />
        </aside>
      ) : null}

      <article data-pagefind-body className={styles.document}>
        <header className={styles.header}>
          <h1 data-pagefind-meta="title">{document.title}</h1>
          <p data-pagefind-meta="description">{document.description}</p>
          {links?.importStatement ? (
            <div className={styles.importBlock}>
              <HighlightedImport value={links.importStatement} />
              <CopyControl label="Copy import statement" value={links.importStatement} />
            </div>
          ) : null}
          {links ? (
            <div className={styles.links} data-pagefind-ignore="all">
              <a href={links.npmUrl} {...externalLinkProps}>
                <NpmIcon aria-hidden className={styles.linkIcon} />
                NPM
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
              </a>
              <a href={links.sourceUrl} {...externalLinkProps}>
                <GithubIcon aria-hidden className={styles.linkIcon} size={13} strokeWidth={1.8} />
                Source
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
              </a>
              <a href={links.editUrl} {...externalLinkProps}>
                <PencilLine aria-hidden className={styles.linkIcon} size={13} strokeWidth={1.8} />
                Edit
                <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
              </a>
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
                <span aria-hidden className={styles.paginationArrow}>
                  ←
                </span>
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
                <span aria-hidden className={styles.paginationArrow}>
                  →
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
        <PageEndActions pathname={document.pathname} />
      </article>

      <TableOfContents contentId="docs-page-content" scopeKey={document.pathname} />
    </main>
  );
}
