import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { type CheerioAPI, load } from 'cheerio';
import ts from 'typescript';

import { siteMetadata } from '../../content/siteMetadata';
import type { DocumentManifestEntry } from '../../types/content';
import type { DocumentationInventory } from '../types';

const BUNDLE_ORIGIN = 'https://lobe-ui.local';
const documentationChromeMarkers = [
  'Open documentation navigation',
  'Search documentation',
  'Skip to documentation',
];
const documentationBoundaryChunks = [
  { label: 'documentation registry', pattern: /(?:^|[-_.])registry(?:[-_.]|$)/i },
  { label: 'documentation Header', pattern: /(?:^|[-_.])header(?:[-_.]|$)/i },
  {
    label: 'documentation navigation',
    pattern: /(?:^|[-_.])(?:navigation|sidebar)(?:[-_.]|$)/i,
  },
  {
    label: 'documentation search',
    pattern: /(?:^|[-_.])search(?:dialog)?(?:[-_.]|$)/i,
  },
];

export interface MigrationCoverageOptions {
  compatibility: DocumentationInventory;
  documents: DocumentManifestEntry[];
  repositoryRoot: string;
}

export interface MigrationCoverageResult {
  diagnostics: string[];
  migrated: number;
  phase: 'complete' | 'partial';
  total: number;
}

const normalizeSource = (source: string): string => source.replaceAll('\\', '/');
const expectedMdxSource = (source: string): string =>
  normalizeSource(source).replace(/\.md$/i, '.mdx');
const legacyMarkdownSource = (source: string): string =>
  expectedMdxSource(source).replace(/\.mdx$/i, '.md');

export function analyzeMigrationCoverage({
  compatibility,
  documents,
  repositoryRoot,
}: MigrationCoverageOptions): MigrationCoverageResult {
  const diagnostics: string[] = [];
  const frozenByMdxSource = new Map<string, DocumentationInventory['documents'][number]>();
  for (const document of compatibility.documents) {
    const source = expectedMdxSource(document.source);
    if (frozenByMdxSource.has(source)) {
      diagnostics.push(`Duplicate frozen document source ${source}.`);
    } else {
      frozenByMdxSource.set(source, document);
    }
  }
  const manifestBySource = new Map<string, DocumentManifestEntry>();
  const manifestByPathname = new Map<string, string>();
  for (const document of documents) {
    const source = normalizeSource(document.source);
    if (manifestBySource.has(source)) {
      diagnostics.push(`Duplicate manifest source ${source}.`);
    } else {
      manifestBySource.set(source, document);
    }
    const previousSource = manifestByPathname.get(document.pathname);
    if (previousSource) {
      diagnostics.push(
        `Duplicate manifest pathname ${document.pathname} for ${previousSource} and ${source}.`,
      );
    } else {
      manifestByPathname.set(document.pathname, source);
    }
  }
  const migratedSources = [...frozenByMdxSource.keys()].filter((source) =>
    existsSync(path.resolve(repositoryRoot, source)),
  );
  const phase = migratedSources.length === frozenByMdxSource.size ? 'complete' : 'partial';

  for (const source of migratedSources) {
    const frozen = frozenByMdxSource.get(source)!;
    const document = manifestBySource.get(source);
    if (!document) {
      diagnostics.push(`Migrated document ${source} is missing from the content manifest.`);
      continue;
    }
    if (document.pathname !== frozen.pathname) {
      diagnostics.push(
        `Frozen pathname mismatch for ${source}: expected ${frozen.pathname}, received ${document.pathname}.`,
      );
    }
  }

  if (phase === 'complete') {
    for (const frozen of compatibility.documents) {
      const legacySource = legacyMarkdownSource(frozen.source);
      if (existsSync(path.resolve(repositoryRoot, legacySource))) {
        diagnostics.push(`Complete migration retains legacy public document ${legacySource}.`);
      }
    }
  }

  return {
    diagnostics: diagnostics.toSorted((left, right) => left.localeCompare(right, 'en')),
    migrated: migratedSources.length,
    phase,
    total: frozenByMdxSource.size,
  };
}

export interface ArtifactAuditOptions extends MigrationCoverageOptions {
  clientDirectory: string;
  expectedStandalonePaths: string[];
  outputDirectory: string;
}

export interface ArtifactDiagnosticsResult {
  coverage: MigrationCoverageResult;
  diagnostics: string[];
}

const normalizePathname = (pathname: string): string => pathname.replace(/\/+$/, '') || '/';

const resolveWithin = (root: string, relative: string): string | undefined => {
  const resolved = path.resolve(root, relative);
  const within = path.relative(root, resolved);
  if (within.startsWith('..') || path.isAbsolute(within)) return;
  return resolved;
};

const encodeArtifactPathSegment = (segment: string): string => encodeURI(segment);

const artifactRelativeHtmlPath = (decodedPathname: string): string => {
  if (decodedPathname === '/') return 'index.html';
  const encoded = decodedPathname
    .replace(/^\//, '')
    .split('/')
    .map(encodeArtifactPathSegment)
    .join('/');
  return `${encoded}/index.html`;
};

export const artifactHtmlPath = (outputDirectory: string, pathname: string): string | undefined => {
  let decoded: string;
  try {
    decoded = decodeURIComponent(normalizePathname(pathname));
  } catch {
    return;
  }
  const candidates = [
    artifactRelativeHtmlPath(decoded),
    decoded === '/' ? 'index.html' : `${decoded.replace(/^\//, '')}/index.html`,
  ];
  for (const relative of new Set(candidates)) {
    const resolved = resolveWithin(outputDirectory, relative);
    if (resolved && existsSync(resolved)) return resolved;
  }
  return resolveWithin(outputDirectory, candidates[0]!);
};

const readHtml = (file: string): CheerioAPI | undefined => {
  try {
    return load(readFileSync(file, 'utf8'));
  } catch {
    return;
  }
};

const content = ($: CheerioAPI, selector: string): string =>
  ($(selector).first().attr('content') ?? '').trim();

const auditDocumentMetadata = (
  document: DocumentManifestEntry,
  file: string,
  $: CheerioAPI,
  diagnostics: string[],
): void => {
  const label = path.relative(path.dirname(path.dirname(file)), file).replaceAll(path.sep, '/');
  const expectedTitle = `${document.title} - ${siteMetadata.name}`;
  const expectedCanonical = new URL(document.pathname, siteMetadata.origin).href;
  const title = $('title').first().text().trim();
  if (title !== expectedTitle) {
    diagnostics.push(`${label}: title must be ${JSON.stringify(expectedTitle)}.`);
  }
  if (content($, 'meta[name="description"]') !== document.description) {
    diagnostics.push(`${label}: description metadata is missing or incorrect.`);
  }
  const canonical = $('link[rel~="canonical"]').first().attr('href')?.trim();
  if (canonical !== expectedCanonical) {
    diagnostics.push(
      `${label}: canonical must be the absolute URL ${expectedCanonical}; received ${canonical ?? 'none'}.`,
    );
  }
  const expectedOpenGraph: Record<string, string> = {
    'og:description': document.description,
    'og:image': siteMetadata.openGraphImage,
    'og:site_name': siteMetadata.name,
    'og:title': expectedTitle,
    'og:type': 'website',
    'og:url': expectedCanonical,
  };
  for (const [property, expected] of Object.entries(expectedOpenGraph)) {
    if (content($, `meta[property="${property}"]`) !== expected) {
      diagnostics.push(`${label}: Open Graph ${property} metadata is missing or incorrect.`);
    }
  }
  if (content($, 'meta[name="twitter:card"]') !== 'summary_large_image') {
    diagnostics.push(`${label}: twitter:card metadata must be summary_large_image.`);
  }
  if ($('article[data-pagefind-body]').length !== 1) {
    diagnostics.push(`${label}: expected exactly one article[data-pagefind-body].`);
  }
};

const collectIds = ($: CheerioAPI): { duplicates: string[]; ids: Set<string> } => {
  const ids = new Set<string>();
  const duplicates = new Set<string>();
  $('[id]').each((_, element) => {
    const id = $(element).attr('id');
    if (!id) return;
    if (ids.has(id)) duplicates.add(id);
    ids.add(id);
  });
  $('a[name]').each((_, element) => {
    const name = $(element).attr('name');
    if (name) ids.add(name);
  });
  return { duplicates: [...duplicates].toSorted(), ids };
};

const collectFiles = (directory: string, suffix: string): string[] => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.resolve(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(absolute, suffix);
    return entry.isFile() && entry.name.endsWith(suffix) ? [absolute] : [];
  });
};

const relativeFileSet = (directory: string, suffix: string): Set<string> =>
  new Set(
    collectFiles(directory, suffix).map((file) =>
      path.relative(directory, file).replaceAll(path.sep, '/'),
    ),
  );

const readModuleRoots = ($: CheerioAPI): string[] =>
  [
    ...$('link[rel~="modulepreload"][href]')
      .map((_, element) => $(element).attr('href') ?? '')
      .get(),
    ...$('script[type="module"][src]')
      .map((_, element) => $(element).attr('src') ?? '')
      .get(),
  ].filter(Boolean);

const readStaticModuleSpecifiers = (source: string, fileName: string): string[] => {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.JS,
  );
  return sourceFile.statements.flatMap((statement) => {
    if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) return [];
    const { moduleSpecifier } = statement;
    return moduleSpecifier && ts.isStringLiteralLike(moduleSpecifier) ? [moduleSpecifier.text] : [];
  });
};

interface BundleAsset {
  displayPath: string;
  source: string;
  staticSpecifiers: string[];
  url: URL;
}

const readBundleAsset = (outputDirectory: string, url: URL): BundleAsset | undefined => {
  if (url.origin !== BUNDLE_ORIGIN || !/\.m?js$/i.test(url.pathname)) return;
  let decoded: string;
  try {
    decoded = decodeURIComponent(url.pathname.slice(1));
  } catch {
    return;
  }
  const file = resolveWithin(outputDirectory, decoded);
  if (!file || !existsSync(file)) return;
  const source = readFileSync(file, 'utf8');
  return {
    displayPath: path.relative(outputDirectory, file).replaceAll(path.sep, '/'),
    source,
    staticSpecifiers: readStaticModuleSpecifiers(source, file),
    url,
  };
};

type BundleAuditMode = 'documentation' | 'standalone';

const bundleReasons = (asset: BundleAsset, mode: BundleAuditMode): string[] => {
  const reasons: string[] = [];
  const fileName = path.basename(asset.displayPath);
  if (mode === 'documentation') {
    if (
      /live-editor|liveeditor|react-live/i.test(fileName) ||
      asset.source.includes('react-live')
    ) {
      reasons.push('react-live');
    }
    if (/giscus/i.test(fileName) || /@giscus\/react|giscus\.app/i.test(asset.source)) {
      reasons.push('Giscus');
    }
    if (/pagefind/i.test(fileName) || /pagefind_web|\/pagefind\/pagefind\.js/i.test(asset.source)) {
      reasons.push('Pagefind');
    }
  } else {
    if (/^docs-layout(?:-[\w-]+)?\.m?js$/i.test(fileName)) {
      reasons.push('documentation layout chunk');
    }
    const boundary = documentationBoundaryChunks.find(({ pattern }) => pattern.test(fileName));
    if (boundary) reasons.push(`${boundary.label} chunk`);
    const marker = documentationChromeMarkers.find((item) => asset.source.includes(item));
    if (marker) reasons.push(`documentation chrome marker ${JSON.stringify(marker)}`);
    if (/@giscus\/react|giscus\.app|pagefind_web|\/pagefind\/pagefind\.js/i.test(asset.source)) {
      reasons.push('documentation-only third-party dependency');
    }
  }
  return reasons;
};

const collectBundleDiagnostics = (
  outputDirectory: string,
  entries: Array<{ $: CheerioAPI; label: string }>,
  mode: BundleAuditMode,
): string[] => {
  const diagnostics: string[] = [];
  const cache = new Map<string, BundleAsset | undefined>();

  for (const entry of entries) {
    const queue = readModuleRoots(entry.$).map((href) => ({
      chain: [] as string[],
      url: new URL(href, `${BUNDLE_ORIGIN}/${entry.label}`),
    }));
    const visited = new Set<string>();
    for (let index = 0; index < queue.length; index += 1) {
      const dependency = queue[index];
      if (visited.has(dependency.url.href)) continue;
      visited.add(dependency.url.href);

      let asset = cache.get(dependency.url.href);
      if (!cache.has(dependency.url.href)) {
        asset = readBundleAsset(outputDirectory, dependency.url);
        cache.set(dependency.url.href, asset);
      }
      if (!asset) {
        diagnostics.push(
          `${entry.label}: static dependency ${dependency.url.pathname} is missing.`,
        );
        continue;
      }
      const chain = [...dependency.chain, asset.displayPath];
      const reasons = bundleReasons(asset, mode);
      if (reasons.length > 0) {
        diagnostics.push(
          `${entry.label}: ${chain.join(' -> ')} violates ${mode} initial graph isolation (${reasons.join(', ')}).`,
        );
      }
      for (const specifier of asset.staticSpecifiers) {
        if (
          !specifier.startsWith('.') &&
          !specifier.startsWith('/') &&
          !/^https?:\/\//i.test(specifier)
        ) {
          continue;
        }
        try {
          queue.push({ chain, url: new URL(specifier, asset.url) });
        } catch {
          diagnostics.push(
            `${entry.label}: ${chain.join(' -> ')} has invalid import ${specifier}.`,
          );
        }
      }
    }
  }
  return diagnostics;
};

export function collectStandaloneBundleIsolationDiagnostics(outputDirectory: string): string[] {
  const directory = path.resolve(outputDirectory, '~demos');
  const entries = collectFiles(directory, '.html').flatMap((file) => {
    const $ = readHtml(file);
    return $ ? [{ $, label: path.relative(outputDirectory, file).replaceAll(path.sep, '/') }] : [];
  });
  return collectBundleDiagnostics(outputDirectory, entries, 'standalone');
}

export function auditStandaloneBundleIsolation(outputDirectory: string): void {
  const diagnostics = collectStandaloneBundleIsolationDiagnostics(outputDirectory);
  if (diagnostics.length > 0) {
    throw new Error(
      `Standalone bundle isolation audit found ${diagnostics.length} documentation dependencies:\n- ${diagnostics.join('\n- ')}\nRemove these static dependencies from the standalone demo entry graph.`,
    );
  }
}

const auditDataFiles = (
  clientDirectory: string,
  outputDirectory: string,
  diagnostics: string[],
): void => {
  const expected = relativeFileSet(clientDirectory, '.data');
  const actual = relativeFileSet(outputDirectory, '.data');
  for (const file of expected) {
    if (!actual.has(file)) diagnostics.push(`React Router data payload ${file} was dropped.`);
  }
  for (const file of actual) {
    if (!expected.has(file))
      diagnostics.push(`Unexpected React Router data payload ${file} was added.`);
  }
};

const resolveInternalTarget = (
  outputDirectory: string,
  pathname: string,
): { html?: string; path?: string } => {
  const normalized = normalizePathname(pathname);
  const html = artifactHtmlPath(outputDirectory, normalized);
  if (html && existsSync(html)) return { html, path: html };

  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname.replace(/^\//, ''));
  } catch {
    return {};
  }
  const asset = resolveWithin(outputDirectory, decoded);
  if (!asset || !existsSync(asset)) return {};
  if (statSync(asset).isDirectory()) {
    const index = path.resolve(asset, 'index.html');
    return existsSync(index) ? { html: index, path: index } : {};
  }
  return { path: asset };
};

const auditInternalLinks = (
  documents: DocumentManifestEntry[],
  outputDirectory: string,
  htmlByPathname: Map<string, { $: CheerioAPI; file: string }>,
  diagnostics: string[],
): void => {
  const targetCache = new Map<string, { $: CheerioAPI; ids: Set<string> } | undefined>();
  for (const document of documents) {
    const source = htmlByPathname.get(document.pathname);
    if (!source) continue;
    source.$('a[href]').each((_, element) => {
      const href = source.$(element).attr('href');
      if (!href || href === '#') return;
      let targetUrl: URL;
      try {
        targetUrl = new URL(href, new URL(document.pathname, siteMetadata.origin));
      } catch {
        diagnostics.push(`${document.pathname}: invalid link ${JSON.stringify(href)}.`);
        return;
      }
      if (
        !['http:', 'https:'].includes(targetUrl.protocol) ||
        targetUrl.origin !== siteMetadata.origin
      ) {
        return;
      }

      const target = resolveInternalTarget(outputDirectory, targetUrl.pathname);
      if (!target.path) {
        diagnostics.push(
          `${document.pathname}: internal link target ${targetUrl.pathname} is missing.`,
        );
        return;
      }
      if (!targetUrl.hash || !target.html) return;

      let targetId: string;
      try {
        targetId = decodeURIComponent(targetUrl.hash.slice(1));
      } catch {
        diagnostics.push(`${document.pathname}: invalid link hash ${targetUrl.hash}.`);
        return;
      }
      if (!targetId) return;
      let parsed = targetCache.get(target.html);
      if (!targetCache.has(target.html)) {
        const $ = readHtml(target.html);
        parsed = $ ? { $, ids: collectIds($).ids } : undefined;
        targetCache.set(target.html, parsed);
      }
      if (!parsed?.ids.has(targetId)) {
        diagnostics.push(
          `${document.pathname}: internal link target ${targetUrl.pathname}#${targetId} has no matching id.`,
        );
      }
    });
  }
};

const auditSitemap = (
  documents: DocumentManifestEntry[],
  outputDirectory: string,
  diagnostics: string[],
): void => {
  const sitemapPath = path.resolve(outputDirectory, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    diagnostics.push('sitemap.xml is missing.');
    return;
  }
  const $ = load(readFileSync(sitemapPath, 'utf8'), { xmlMode: true });
  const locations = $('loc')
    .map((_, element) => $(element).text().trim())
    .get();
  const counts = new Map<string, number>();
  for (const location of locations) counts.set(location, (counts.get(location) ?? 0) + 1);
  for (const [location, count] of counts) {
    if (count > 1) diagnostics.push(`sitemap.xml contains duplicate URL ${location}.`);
    let url: URL;
    try {
      url = new URL(location);
    } catch {
      diagnostics.push(`sitemap.xml contains invalid URL ${location}.`);
      continue;
    }
    if (url.origin !== siteMetadata.origin) {
      diagnostics.push(`sitemap.xml has wrong origin ${url.origin}.`);
    }
    if (
      url.pathname === '/404' ||
      url.pathname === '/__spa-fallback.html' ||
      url.pathname === '/~demos' ||
      url.pathname.startsWith('/~demos/')
    ) {
      diagnostics.push(`sitemap.xml contains excluded URL ${location}.`);
    }
  }

  const expected = new Set(
    documents.map(({ pathname }) => new URL(pathname, siteMetadata.origin).href),
  );
  const actual = new Set(locations);
  for (const location of expected) {
    if (!actual.has(location)) diagnostics.push(`sitemap.xml is missing ${location}.`);
  }
  for (const location of actual) {
    if (!expected.has(location))
      diagnostics.push(`sitemap.xml contains unexpected URL ${location}.`);
  }
};

const auditPagefind = (
  documents: DocumentManifestEntry[],
  outputDirectory: string,
  diagnostics: string[],
): void => {
  const pagefindDirectory = path.resolve(outputDirectory, 'pagefind');
  if (!existsSync(path.resolve(pagefindDirectory, 'pagefind.js'))) {
    diagnostics.push('Pagefind primary asset pagefind/pagefind.js is missing.');
  }
  const fragments = [
    ...collectFiles(pagefindDirectory, '.pf_index'),
    ...collectFiles(pagefindDirectory, '.pf_meta'),
    ...collectFiles(pagefindDirectory, '.pf_fragment'),
  ];
  if (fragments.length === 0) diagnostics.push('Pagefind index fragments are missing.');

  const receiptPath = path.resolve(pagefindDirectory, 'pagefind-audit.json');
  if (!existsSync(receiptPath)) {
    diagnostics.push('Pagefind coverage receipt pagefind/pagefind-audit.json is missing.');
    return;
  }
  let receipt: { pageCount?: unknown; routes?: unknown; schemaVersion?: unknown };
  try {
    receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
  } catch (error) {
    diagnostics.push(
      `Pagefind coverage receipt is invalid JSON: ${error instanceof Error ? error.message : String(error)}.`,
    );
    return;
  }
  if (receipt.schemaVersion !== 1) {
    diagnostics.push('Pagefind coverage receipt has an unsupported schema version.');
  }
  if (typeof receipt.pageCount !== 'number' || !Array.isArray(receipt.routes)) {
    diagnostics.push('Pagefind coverage receipt must contain numeric pageCount and routes.');
    return;
  }
  const routes = receipt.routes.filter((route): route is string => typeof route === 'string');
  if (routes.length !== receipt.routes.length) {
    diagnostics.push('Pagefind coverage receipt contains a non-string route.');
  }
  if (receipt.pageCount !== documents.length) {
    diagnostics.push(
      `Pagefind page count ${receipt.pageCount} does not match current document count ${documents.length}.`,
    );
  }
  if (receipt.pageCount !== routes.length) {
    diagnostics.push(
      `Pagefind page count ${receipt.pageCount} does not match receipt route count ${routes.length}.`,
    );
  }
  const routeCounts = new Map<string, number>();
  for (const route of routes) routeCounts.set(route, (routeCounts.get(route) ?? 0) + 1);
  for (const [route, count] of routeCounts) {
    if (count > 1) diagnostics.push(`Pagefind coverage receipt contains duplicate route ${route}.`);
    if (route === '/~demos' || route.startsWith('/~demos/')) {
      diagnostics.push(`Pagefind route ${route} must be excluded from the index.`);
    }
  }
  const expected = new Set(documents.map(({ pathname }) => normalizePathname(pathname)));
  const actual = new Set(routes.map(normalizePathname));
  for (const route of expected) {
    if (!actual.has(route)) diagnostics.push(`Pagefind is missing document route ${route}.`);
  }
  for (const route of actual) {
    if (!expected.has(route)) diagnostics.push(`Pagefind contains unexpected route ${route}.`);
  }
};

const auditRobots = (outputDirectory: string, diagnostics: string[]): void => {
  const robotsPath = path.resolve(outputDirectory, 'robots.txt');
  if (!existsSync(robotsPath)) {
    diagnostics.push('robots.txt is missing.');
    return;
  }
  const robots = readFileSync(robotsPath, 'utf8');
  if (!/^Disallow:\s*\/~demos\/$/im.test(robots)) {
    diagnostics.push('robots.txt must disallow /~demos/.');
  }
  if (!robots.includes(`${siteMetadata.origin}/sitemap.xml`)) {
    diagnostics.push(`robots.txt must advertise ${siteMetadata.origin}/sitemap.xml.`);
  }
};

export function collectArtifactDiagnostics(
  options: ArtifactAuditOptions,
): ArtifactDiagnosticsResult {
  const { clientDirectory, documents, expectedStandalonePaths, outputDirectory } = options;
  const coverage = analyzeMigrationCoverage(options);
  const diagnostics = [...coverage.diagnostics];
  const htmlByPathname = new Map<string, { $: CheerioAPI; file: string }>();

  for (const document of documents) {
    const file = artifactHtmlPath(outputDirectory, document.pathname);
    if (!file || !existsSync(file)) {
      diagnostics.push(`Documentation route ${document.pathname} is missing its HTML artifact.`);
      continue;
    }
    const $ = readHtml(file);
    if (!$) {
      diagnostics.push(`Documentation route ${document.pathname} has unreadable HTML.`);
      continue;
    }
    htmlByPathname.set(document.pathname, { $, file });
    auditDocumentMetadata(document, file, $, diagnostics);
    const { duplicates } = collectIds($);
    for (const id of duplicates) {
      diagnostics.push(`${document.pathname}: duplicate id ${JSON.stringify(id)}.`);
    }
  }

  for (const pathname of expectedStandalonePaths) {
    const file = artifactHtmlPath(outputDirectory, pathname);
    if (!file || !existsSync(file)) {
      diagnostics.push(`Standalone route ${pathname} is missing its HTML artifact.`);
      continue;
    }
    const $ = readHtml(file);
    if (!$) {
      diagnostics.push(`Standalone route ${pathname} has unreadable HTML.`);
      continue;
    }
    const robots = content($, 'meta[name="robots"]')
      .toLocaleLowerCase('en')
      .split(/[\s,]+/);
    if (!robots.includes('noindex')) {
      diagnostics.push(`Standalone route ${pathname} is missing noindex metadata.`);
    }
    if (!robots.includes('nofollow')) {
      diagnostics.push(`Standalone route ${pathname} is missing nofollow metadata.`);
    }
    if ($('[data-pagefind-body]').length > 0) {
      diagnostics.push(`Standalone route ${pathname} must not opt into Pagefind indexing.`);
    }
    if ($('script[data-domain], script[src*="plausible" i]').length > 0) {
      diagnostics.push(`Standalone route ${pathname} includes Plausible analytics.`);
    }
    if ($('script[src*="giscus" i], script[src*="pagefind" i]').length > 0) {
      diagnostics.push(
        `Standalone route ${pathname} includes deferred documentation dependencies.`,
      );
    }
  }

  diagnostics.push(
    ...collectBundleDiagnostics(
      outputDirectory,
      [...htmlByPathname.values()].map(({ $, file }) => ({
        $,
        label: path.relative(outputDirectory, file).replaceAll(path.sep, '/'),
      })),
      'documentation',
    ),
    ...collectStandaloneBundleIsolationDiagnostics(outputDirectory),
  );

  const fallback = path.resolve(outputDirectory, '__spa-fallback.html');
  if (!existsSync(fallback)) diagnostics.push('__spa-fallback.html is missing.');

  const notFound = path.resolve(outputDirectory, '404.html');
  const notFoundHtml = readHtml(notFound);
  if (!notFoundHtml) {
    diagnostics.push('404.html is missing or unreadable.');
  } else if (!content(notFoundHtml, 'meta[name="robots"]').includes('noindex')) {
    diagnostics.push('404.html must contain noindex metadata.');
  }

  auditInternalLinks(documents, outputDirectory, htmlByPathname, diagnostics);
  auditSitemap(documents, outputDirectory, diagnostics);
  auditRobots(outputDirectory, diagnostics);
  auditPagefind(documents, outputDirectory, diagnostics);
  auditDataFiles(clientDirectory, outputDirectory, diagnostics);

  return {
    coverage,
    diagnostics: [...new Set(diagnostics)].toSorted((left, right) =>
      left.localeCompare(right, 'en'),
    ),
  };
}

export function auditDocumentationArtifact(options: ArtifactAuditOptions): MigrationCoverageResult {
  const result = collectArtifactDiagnostics(options);
  if (result.diagnostics.length > 0) {
    throw new Error(
      `Documentation artifact audit failed with ${result.diagnostics.length} diagnostics:\n- ${result.diagnostics.join('\n- ')}`,
    );
  }
  return result.coverage;
}
