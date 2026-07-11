import { copyFileSync, cpSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

export interface FinalizeBuildOptions {
  clientDirectory: string;
  outputDirectory: string;
}

const documentationChromeMarkers = [
  'Open documentation navigation',
  'Search documentation',
  'Skip to documentation',
];

const documentationLayoutChunkPattern = /^docs-layout(?:-[\w-]+)?\.m?js$/i;

interface BundleDependency {
  chain: string[];
  url: URL;
}

interface BundleIsolationViolation {
  chain: string[];
  htmlPath: string;
  reasons: string[];
}

interface ParsedBundleAsset {
  reasons: string[];
  staticSpecifiers: string[];
}

const findHtmlFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((name) => {
    const entry = path.resolve(directory, name);
    return statSync(entry).isDirectory()
      ? findHtmlFiles(entry)
      : name.endsWith('.html')
        ? [entry]
        : [];
  });

const readModulePreloads = (html: string): string[] =>
  [...html.matchAll(/<link\b[^>]*>/gi)].flatMap(([tag]) => {
    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1];
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
    return rel?.split(/\s+/).includes('modulepreload') && href ? [href] : [];
  });

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

const resolveOutputAsset = (
  outputDirectory: string,
  origin: string,
  url: URL,
): { displayPath: string; path: string } | undefined => {
  if (url.origin !== origin || !/\.m?js$/i.test(url.pathname)) return;
  const assetPath = path.resolve(outputDirectory, decodeURIComponent(url.pathname.slice(1)));
  const relativePath = path.relative(outputDirectory, assetPath);
  if (!relativePath || relativePath.startsWith('..') || path.isAbsolute(relativePath)) return;
  return { displayPath: relativePath.replaceAll(path.sep, '/'), path: assetPath };
};

const resolveStaticSpecifier = (specifier: string, importer: URL): URL | undefined => {
  if (
    !specifier.startsWith('.') &&
    !specifier.startsWith('/') &&
    !/^https?:\/\//i.test(specifier)
  ) {
    return;
  }

  try {
    return new URL(specifier, importer);
  } catch {
    return;
  }
};

export function auditStandaloneBundleIsolation(outputDirectory: string): void {
  const standaloneDirectory = path.resolve(outputDirectory, '~demos');
  try {
    if (!statSync(standaloneDirectory).isDirectory()) return;
  } catch {
    return;
  }

  const violations: BundleIsolationViolation[] = [];
  const parsedAssets = new Map<string, ParsedBundleAsset | undefined>();

  for (const htmlPath of findHtmlFiles(standaloneDirectory)) {
    const html = readFileSync(htmlPath, 'utf8');
    const relativeHtmlPath = path.relative(outputDirectory, htmlPath).replaceAll(path.sep, '/');
    const baseUrl = new URL(relativeHtmlPath, 'https://lobe-ui.local/');
    const dependencies: BundleDependency[] = readModulePreloads(html).map((href) => ({
      chain: [],
      url: new URL(href, baseUrl),
    }));
    const visited = new Set<string>();

    for (let index = 0; index < dependencies.length; index += 1) {
      const dependency = dependencies[index];
      if (visited.has(dependency.url.href)) continue;
      visited.add(dependency.url.href);

      const resolvedAsset = resolveOutputAsset(outputDirectory, baseUrl.origin, dependency.url);
      if (!resolvedAsset) continue;
      const chain = [...dependency.chain, resolvedAsset.displayPath];
      let parsedAsset = parsedAssets.get(resolvedAsset.path);
      if (!parsedAssets.has(resolvedAsset.path)) {
        try {
          const source = readFileSync(resolvedAsset.path, 'utf8');
          const reasons: string[] = [];
          if (documentationLayoutChunkPattern.test(path.basename(resolvedAsset.path))) {
            reasons.push('documentation layout chunk');
          }
          const marker = documentationChromeMarkers.find((item) => source.includes(item));
          if (marker) reasons.push(`documentation chrome marker ${JSON.stringify(marker)}`);
          parsedAsset = {
            reasons,
            staticSpecifiers: readStaticModuleSpecifiers(source, resolvedAsset.path),
          };
        } catch {
          parsedAsset = undefined;
        }
        parsedAssets.set(resolvedAsset.path, parsedAsset);
      }
      if (!parsedAsset) continue;

      if (parsedAsset.reasons.length > 0) {
        violations.push({ chain, htmlPath: relativeHtmlPath, reasons: parsedAsset.reasons });
      }

      for (const specifier of parsedAsset.staticSpecifiers) {
        const url = resolveStaticSpecifier(specifier, dependency.url);
        if (url) dependencies.push({ chain, url });
      }
    }
  }

  if (violations.length > 0) {
    throw new Error(
      [
        `Standalone bundle isolation audit found ${violations.length} documentation ${violations.length === 1 ? 'dependency' : 'dependencies'}.`,
        ...violations.map(
          ({ chain, htmlPath, reasons }) =>
            `- ${htmlPath}: ${chain.join(' -> ')} (${reasons.join(', ')})`,
        ),
        'Remove these static dependencies from the standalone demo entry graph.',
      ].join('\n'),
    );
  }
}

export function finalizeDocumentationBuild({
  clientDirectory,
  outputDirectory,
}: FinalizeBuildOptions): void {
  rmSync(outputDirectory, { force: true, recursive: true });
  cpSync(clientDirectory, outputDirectory, { recursive: true });
  copyFileSync(
    path.resolve(outputDirectory, '__spa-fallback.html'),
    path.resolve(outputDirectory, '404.html'),
  );
  auditStandaloneBundleIsolation(outputDirectory);
}

const entryPath = process.argv[1];

if (entryPath && fileURLToPath(import.meta.url) === path.resolve(entryPath)) {
  finalizeDocumentationBuild({
    clientDirectory: path.resolve('.react-router/build/client'),
    outputDirectory: path.resolve('dist'),
  });
}
