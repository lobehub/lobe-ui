import { use } from 'react';
import type { MetaFunction } from 'react-router';
import { useLocation } from 'react-router';

import DocsLayout from '../../components/DocsLayout/DocsLayout';
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
  if (!document) return [{ title: 'Documentation not found - Lobe UI' }];

  return [
    { title: `${document.title} - Lobe UI` },
    { content: document.description, name: 'description' },
    { href: document.pathname, rel: 'canonical', tagName: 'link' },
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
