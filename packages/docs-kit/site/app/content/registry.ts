import siteConfig from 'virtual:lobedocs/site-config';

import { createNavigation, toFrozenNavigationDocuments } from '../../content/navigation';
import { canonicalizePathname } from '../../content/pathname';
import type { ContentManifest, DocumentManifestEntry, MDXModule } from '../../types/content';

type DocumentLoader = () => Promise<MDXModule>;

interface ReactImportPromise<T> extends Promise<T> {
  reason?: unknown;
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
}

const componentMetadata = import.meta.glob<DocumentManifestEntry>('/src/**/index.mdx', {
  eager: true,
  import: 'default',
  query: '?document-metadata',
});
const publicMetadata = import.meta.glob<DocumentManifestEntry>(
  ['/docs/index.mdx', '/docs/changelog.mdx'],
  {
    eager: true,
    import: 'default',
    query: '?document-metadata',
  },
);

const publicModuleLoaders = import.meta.glob<MDXModule>(['/docs/index.mdx', '/docs/changelog.mdx']);

const moduleLoaders: Record<string, DocumentLoader> = {
  ...publicModuleLoaders,
  ...import.meta.glob<MDXModule>('/src/**/index.mdx'),
};

const documents = [...Object.values(publicMetadata), ...Object.values(componentMetadata)].toSorted(
  (left, right) => left.pathname.localeCompare(right.pathname, 'en'),
);

export const contentManifest: ContentManifest = {
  documents,
  navigation: createNavigation(documents, toFrozenNavigationDocuments(siteConfig.navSections)),
};

const entriesByPathname = new Map<string, DocumentManifestEntry>();
const loadersByPathname = new Map<string, DocumentLoader>();

for (const document of contentManifest.documents) {
  const pathname = canonicalizePathname(document.pathname);
  const previousDocument = entriesByPathname.get(pathname);
  if (previousDocument) {
    throw new Error(
      `Duplicate documentation pathname "${pathname}" for ${previousDocument.source} and ${document.source}`,
    );
  }

  const loader = moduleLoaders[`/${document.source}`];
  if (!loader) throw new Error(`Missing lazy MDX module for ${document.source}`);
  entriesByPathname.set(pathname, document);
  loadersByPathname.set(pathname, loader);
}

const importPromises = new Map<string, ReactImportPromise<MDXModule>>();

const trackImport = (promise: Promise<MDXModule>): ReactImportPromise<MDXModule> => {
  const tracked = promise as ReactImportPromise<MDXModule>;
  tracked.status = 'pending';
  tracked.then(
    (value) => {
      tracked.status = 'fulfilled';
      tracked.value = value;
    },
    (reason: unknown) => {
      tracked.status = 'rejected';
      tracked.reason = reason;
    },
  );
  return tracked;
};

export function findDocument(pathname: string): DocumentManifestEntry | undefined {
  return entriesByPathname.get(canonicalizePathname(pathname));
}

export function loadDocument(pathname: string): Promise<MDXModule> {
  const normalizedPathname = canonicalizePathname(pathname);
  const cached = importPromises.get(normalizedPathname);
  if (cached) return cached;

  const loader = loadersByPathname.get(normalizedPathname);
  if (!loader) {
    return Promise.reject(new Error(`Unknown documentation pathname: ${normalizedPathname}`));
  }

  const promise = trackImport(loader());
  importPromises.set(normalizedPathname, promise);
  return promise;
}
