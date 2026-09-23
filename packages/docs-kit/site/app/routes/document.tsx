import { use } from 'react';
import type { MetaFunction } from 'react-router';
import { useLocation } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { DocsLayout } from '../../components/DocsLayout/DocsLayout';
import { overviewMeta } from '../../components/SectionOverview/meta';
import { SectionOverview } from '../../components/SectionOverview/SectionOverview';
import { findOverview } from '../../content/sectionOverview';
import type { DocumentManifestEntry } from '../../types/content';
import { contentManifest, findDocument, loadDocument } from '../content/registry';
import NotFound from './not-found';

const DocumentContent = ({ document }: { document: DocumentManifestEntry }) => {
  const module = use(loadDocument(document.pathname));
  const Content = module.default;
  return <Content />;
};

export const meta: MetaFunction = ({ location }) => {
  const overview = findOverview(contentManifest.navigation, location.pathname);
  if (overview) return overviewMeta(overview, location.pathname);

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
    { href: new URL('/llms.txt', siteConfig.siteUrl).href, rel: 'describedby', tagName: 'link' },
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
  const overview = findOverview(contentManifest.navigation, location.pathname);
  if (overview) return <SectionOverview {...overview} />;

  const document = findDocument(location.pathname);
  if (!document) return <NotFound />;

  return (
    <DocsLayout document={document} navigation={contentManifest.navigation}>
      <DocumentContent document={document} />
    </DocsLayout>
  );
}
