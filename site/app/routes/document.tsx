import { use } from 'react';
import type { MetaFunction } from 'react-router';
import { useLocation } from 'react-router';

import { DocsLayout } from '../../components/DocsLayout/DocsLayout';
import { siteMetadata } from '../../content/siteMetadata';
import type { DocumentManifestEntry } from '../../types/content';
import { contentManifest, findDocument, loadDocument } from '../content/registry';

const DocumentContent = ({ document }: { document: DocumentManifestEntry }) => {
  const module = use(loadDocument(document.pathname));
  const Content = module.default;
  return <Content />;
};

const getDocumentOrThrow = (pathname: string): DocumentManifestEntry => {
  const document = findDocument(pathname);
  if (document) return document;

  throw new Response('Documentation not found', {
    status: 404,
    statusText: 'Not Found',
  });
};

export const meta: MetaFunction = ({ location }) => {
  const document = findDocument(location.pathname);
  if (!document) {
    return [
      { title: 'Documentation not found - Lobe UI' },
      { content: 'noindex, nofollow', name: 'robots' },
    ];
  }

  const title = `${document.title} - ${siteMetadata.name}`;
  const canonicalUrl = new URL(document.pathname, siteMetadata.origin).href;

  return [
    { title },
    { content: document.description, name: 'description' },
    { href: canonicalUrl, rel: 'canonical', tagName: 'link' },
    { content: 'website', property: 'og:type' },
    { content: siteMetadata.name, property: 'og:site_name' },
    { content: title, property: 'og:title' },
    { content: document.description, property: 'og:description' },
    { content: canonicalUrl, property: 'og:url' },
    { content: siteMetadata.openGraphImage, property: 'og:image' },
    { content: 'summary_large_image', name: 'twitter:card' },
  ];
};

export default function DocumentRoute() {
  const location = useLocation();
  const document = getDocumentOrThrow(location.pathname);

  return (
    <DocsLayout document={document} navigation={contentManifest.navigation}>
      <DocumentContent document={document} />
    </DocsLayout>
  );
}
