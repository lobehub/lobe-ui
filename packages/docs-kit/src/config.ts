import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { DocumentationInventory } from './types';

export interface AtomDirConfig {
  dir: string;
  subType?: string;
  type?: string;
}

export interface DocsNavItem {
  external?: boolean;
  href: string;
  label: string;
}

export interface DocsSocialLink {
  href: string;
  icon?: string;
  label: string;
}

export interface DocsGiscusConfig {
  category: string;
  categoryId: string;
  repo: string;
  repoId: string;
}

export interface DocsAnalyticsConfig {
  plausible?: {
    domain: string;
    source: string;
  };
}

export interface DocsMetadataConfig {
  openGraph?: {
    image?: string;
  };
}

export interface DocsThemeConfig {
  actions?: DocsNavItem[];
  analytics?: DocsAnalyticsConfig;
  apiHeader?: string;
  giscus?: DocsGiscusConfig;
  metadata?: DocsMetadataConfig;
  navItems?: DocsNavItem[];
  prefersColor?: 'auto' | 'dark' | 'light';
  socialLinks?: DocsSocialLink[];
}

export interface DocsConfig {
  alias?: Record<string, string>;
  atomDirs: AtomDirConfig[];
  description: string;
  favicons?: Record<string, string>;
  legacyRedirects?: DocumentationInventory;
  navSections: Record<string, string>;
  siteUrl: string;
  themeConfig?: DocsThemeConfig;
  title: string;
}

export type ClientSiteConfig = Pick<
  DocsConfig,
  'description' | 'favicons' | 'navSections' | 'siteUrl' | 'themeConfig' | 'title'
>;

export const emptyLegacyRedirects: DocumentationInventory = {
  demoReferences: [],
  documents: [],
};

export function defineDocsConfig(config: DocsConfig): DocsConfig {
  return config;
}

const configCache = new Map<string, DocsConfig>();

// Loaded out-of-process via `node --import tsx` rather than in-process esbuild:
// esbuild's Node API fails its own startup invariant check
// (`new TextEncoder().encode("") instanceof Uint8Array`) when required from
// inside a Vitest jsdom environment, because jsdom's TextEncoder shadows the
// realm's built-in one. Running in a fresh Node subprocess sidesteps that.
//
// `tsx`'s loader is resolved from this module's own location (not from
// `root`) so consumer roots that lack a hoisted `tsx` dependency of their
// own — e.g. isolated test fixtures — still work.
const tsxLoaderUrl = pathToFileURL(createRequire(import.meta.url).resolve('tsx')).href;

const loadConfigInSubprocess = (configPath: string, root: string): DocsConfig => {
  const configUrl = pathToFileURL(configPath).href;
  const resultDirectory = mkdtempSync(join(tmpdir(), 'lobedocs-config-'));
  const resultPath = join(resultDirectory, 'result.json');
  const resultUrl = pathToFileURL(resultPath).href;
  // In a package without "type": "module", tsx's loader falls back to CJS
  // interop and double-wraps the export (`mod.default.default`) instead of
  // exposing it directly (`mod.default`) — unwrap defensively for both.
  // The result is written to a temp file rather than stdout so a consumer
  // config that itself prints to stdout (directly or via a dependency)
  // cannot corrupt the JSON payload; stdout/stderr are captured and relayed
  // rather than inherited, since inheriting a subprocess's stdio here can
  // clobber a host process's own stdio-based IPC (e.g. a Vitest worker).
  const script = `
    const { writeFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const mod = await import(${JSON.stringify(configUrl)});
    const exported = mod.default ?? mod;
    const config = exported && typeof exported === 'object' && 'default' in exported
      ? exported.default
      : exported;
    writeFileSync(fileURLToPath(${JSON.stringify(resultUrl)}), JSON.stringify(config));
  `;

  try {
    const child = spawnSync(
      process.execPath,
      ['--import', tsxLoaderUrl, '--input-type=module', '-e', script],
      { cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 },
    );
    if (child.stdout) process.stdout.write(child.stdout);
    if (child.stderr) process.stderr.write(child.stderr);
    if (child.error) throw child.error;
    if (child.status !== 0) {
      throw new Error(
        `Failed to load docs.config.ts at ${configPath} (exit code ${child.status}).`,
      );
    }

    const config = JSON.parse(readFileSync(resultPath, 'utf8')) as DocsConfig;
    if (!config || typeof config !== 'object') {
      throw new Error(`docs.config.ts at ${configPath} must have a default export.`);
    }
    return config;
  } finally {
    rmSync(resultDirectory, { force: true, recursive: true });
  }
};

export function getDocsConfig(root: string): DocsConfig {
  const configPath = resolve(root, 'docs.config.ts');
  const cached = configCache.get(configPath);
  if (cached) return cached;

  const config = loadConfigInSubprocess(configPath, root);
  configCache.set(configPath, config);
  return config;
}

export async function loadDocsConfig(root: string): Promise<DocsConfig> {
  return getDocsConfig(root);
}

export function clearDocsConfigCache(): void {
  configCache.clear();
}
