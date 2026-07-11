import { copyFileSync, cpSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface FinalizeBuildOptions {
  clientDirectory: string;
  outputDirectory: string;
}

const documentationChromeMarkers = [
  'Open documentation navigation',
  'Search documentation',
  'Skip to documentation',
];

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

export function auditStandaloneBundleIsolation(outputDirectory: string): void {
  const standaloneDirectory = path.resolve(outputDirectory, '~demos');
  try {
    if (!statSync(standaloneDirectory).isDirectory()) return;
  } catch {
    return;
  }

  for (const htmlPath of findHtmlFiles(standaloneDirectory)) {
    const html = readFileSync(htmlPath, 'utf8');
    const relativeHtmlPath = path.relative(outputDirectory, htmlPath).replaceAll(path.sep, '/');
    const baseUrl = new URL(relativeHtmlPath, 'https://lobe-ui.local/');
    for (const href of readModulePreloads(html)) {
      const assetUrl = new URL(href, baseUrl);
      if (assetUrl.origin !== baseUrl.origin) continue;
      const assetPath = path.resolve(
        outputDirectory,
        decodeURIComponent(assetUrl.pathname.slice(1)),
      );
      let asset: string;
      try {
        asset = readFileSync(assetPath, 'utf8');
      } catch {
        continue;
      }
      const marker = documentationChromeMarkers.find((item) => asset.includes(item));
      if (marker) {
        throw new Error(
          `Standalone bundle preloads documentation chrome (${JSON.stringify(marker)}) via ${href} in ${relativeHtmlPath}.`,
        );
      }
    }
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
