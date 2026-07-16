import { use } from 'react';
import type { MetaFunction } from 'react-router';
import { useLocation } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { DocsLayout } from '../../components/DocsLayout/DocsLayout';
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
      { title: `Documentation not found - ${siteConfig.title}` },
      { content: 'noindex, nofollow', name: 'robots' },
    ];
  }

  const title = `${document.title} - ${siteConfig.title}`;
  const canonicalUrl = new URL(document.pathname, siteConfig.siteUrl).href;
  const openGraphImage = siteConfig.themeConfig?.metadata?.openGraph?.image ?? '';

  return [
    { title },
    { content: document.description, name: 'description' },
    { href: canonicalUrl, rel: 'canonical', tagName: 'link' },
    { content: 'website', property: 'og:type' },
    { content: siteConfig.title, property: 'og:site_name' },
    { content: title, property: 'og:title' },
    { content: document.description, property: 'og:description' },
    { content: canonicalUrl, property: 'og:url' },
    { content: openGraphImage, property: 'og:image' },
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
