import './DocsLayout.css';

import { Snippet } from '@lobehub/ui';
import { GithubIcon } from '@lobehub/ui/icons';
import * as stylex from '@stylexjs/stylex';
import { ArrowLeft, ArrowRight, ArrowUpRight, PencilLine } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { createDocumentLinks, findAdjacentDocuments } from '../../content/pageChrome';
import type {
  DocumentHeading,
  DocumentManifestEntry,
  NavigationSection,
} from '../../types/content';
import { PageEndActions } from '../Feedback/PageEndActions';
import { TableOfContents } from '../TableOfContents/TableOfContents';
import { paginationMarker } from './markers.stylex';
import { NpmIcon } from './NpmIcon';
import { styles } from './style';

interface DocsLayoutProps {
  children: ReactNode;
  document: DocumentManifestEntry;
  headings?: DocumentHeading[];
  navigation: NavigationSection[];
}

const externalLinkProps = { rel: 'noreferrer', target: '_blank' } as const;

export function DocsLayout({ children, document, headings, navigation }: DocsLayoutProps) {
  const links = createDocumentLinks(document, siteConfig.themeConfig?.apiHeader);
  const { next, previous } = findAdjacentDocuments(navigation, document.pathname);

  return (
    <div {...stylex.props(styles.root)} id="docs-content">
      <div data-docs-grid="" {...stylex.props(styles.grid)}>
        <article data-pagefind-body {...stylex.props(styles.document)}>
          <header {...stylex.props(styles.header)}>
            <h1 data-pagefind-meta="title" {...stylex.props(styles.title)}>
              {document.title}
            </h1>
            <p data-pagefind-meta="description" {...stylex.props(styles.description)}>
              {document.description}
            </p>
            {links?.importStatement ? (
              <Snippet {...stylex.props(styles.importBlock)} language="tsx">
                {links.importStatement}
              </Snippet>
            ) : null}
            {links ? (
              <div {...stylex.props(styles.links)} data-pagefind-ignore="all">
                <a href={links.npmUrl} {...externalLinkProps} {...stylex.props(styles.link)}>
                  <NpmIcon aria-hidden {...stylex.props(styles.linkIcon)} />
                  NPM
                  <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
                </a>
                {links.sourceUrl ? (
                  <a href={links.sourceUrl} {...externalLinkProps} {...stylex.props(styles.link)}>
                    <GithubIcon
                      aria-hidden
                      {...stylex.props(styles.linkIcon)}
                      size={13}
                      strokeWidth={1.8}
                    />
                    Source
                    <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
                  </a>
                ) : null}
                {links.editUrl ? (
                  <a href={links.editUrl} {...externalLinkProps} {...stylex.props(styles.link)}>
                    <PencilLine
                      aria-hidden
                      {...stylex.props(styles.linkIcon)}
                      size={13}
                      strokeWidth={1.8}
                    />
                    Edit
                    <ArrowUpRight aria-hidden size={13} strokeWidth={1.8} />
                  </a>
                ) : null}
              </div>
            ) : null}
            <div {...stylex.props(styles.searchMetadata)}>
              {document.category ? (
                <span data-pagefind-meta="category">{document.category}</span>
              ) : null}
              {document.status ? <span data-pagefind-meta="status">{document.status}</span> : null}
            </div>
          </header>
          <div className="docs-content" id="docs-page-content">
            {children}
          </div>
          {previous || next ? (
            <nav aria-label="Adjacent documents" {...stylex.props(styles.pagination)}>
              {previous ? (
                <Link
                  {...stylex.props(styles.paginationLink, paginationMarker)}
                  rel="prev"
                  to={previous.pathname}
                >
                  <ArrowLeft
                    aria-hidden
                    {...stylex.props(styles.paginationArrow)}
                    size={16}
                    strokeWidth={1.8}
                  />
                  <span {...stylex.props(styles.paginationText)}>
                    <span {...stylex.props(styles.paginationLabel)}>Previous</span>
                    <strong {...stylex.props(styles.paginationTitle)}>{previous.title}</strong>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  {...stylex.props(
                    styles.paginationLink,
                    styles.paginationLinkNext,
                    paginationMarker,
                  )}
                  rel="next"
                  to={next.pathname}
                >
                  <span {...stylex.props(styles.paginationText)}>
                    <span {...stylex.props(styles.paginationLabel)}>Next</span>
                    <strong {...stylex.props(styles.paginationTitle)}>{next.title}</strong>
                  </span>
                  <ArrowRight
                    aria-hidden
                    {...stylex.props(styles.paginationArrow)}
                    size={16}
                    strokeWidth={1.8}
                  />
                </Link>
              ) : null}
            </nav>
          ) : null}
          <PageEndActions pathname={document.pathname} />
        </article>

        <TableOfContents
          contentId="docs-page-content"
          headings={headings}
          scopeKey={document.pathname}
        />
      </div>
    </div>
  );
}
