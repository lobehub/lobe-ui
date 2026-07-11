# Dumi Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace dumi with a Vite and React Router documentation application that preserves public routes, migrates documentation to MDX, renders real demos with optional `react-live` editing, generates TypeScript API references, and produces a static searchable site.

**Architecture:** A build-only compiler scans colocated MDX and demo files, freezes dumi compatibility data, and exposes small route, navigation, demo, and API manifests. React Router Framework Mode runs as a Vite SPA in development and pre-renders every public path at build time. Canonical demos remain lazy Vite modules; editing, Pagefind, and unrelated demos stay outside the initial bundle.

**Tech Stack:** React 19.2.7, TypeScript 6.0.3, React Router 7.18.1, Vite 7.3.6, MDX 3.1.1, react-live 4.1.8, Pagefind 1.5.2, Vitest 3.2.6, Playwright 1.61.1.

## Global Constraints

- Require Node.js `>=22.12.0`; the implementation environment currently uses Node.js 24.15.0.
- Keep the repository's deliberate no-lockfile policy (`.npmrc` and `.bunfig.toml`); do not add a lockfile.
- Pin the coordinated React Router/Vite toolchain exactly: `react-router@7.18.1`, `@react-router/dev@7.18.1`, and `vite@7.3.6`.
- Keep all documentation-only packages in `devDependencies`; they must not appear in the published `@lobehub/ui` dependency surface.
- Keep component MDX and demos colocated under `src/`; keep internal specifications under `docs/superpowers/**` unpublished.
- Preserve all existing component paths and every frozen `/~demos/:demoId?routeId=...` URL, including IDs containing commas and spaces.
- Treat the current executable migration surface as 158 component documents, two public `docs/` documents, 367 demo references, and 35 iframe demos; regenerate and verify these values before migration.
- Render documentation prose and API output into static HTML; never evaluate browser-only demo modules during prerendering.
- Use behavior-oriented tests. Do not snapshot static manifest objects, route tables, or constant declarations.
- Use `rtk` for shell commands, `apply_patch` for hand-authored file edits, and non-destructive Git operations.
- The approved design specification remains authoritative: `docs/superpowers/specs/2026-07-11-dumi-replacement-design.md`.

---

### Task 1: Freeze the dumi inventory and neutralize shared configuration

**Files:**

- Create: `config/packageNamespaces.ts`
- Create: `site/compiler/types.ts`
- Create: `site/compiler/inventory.ts`
- Create: `site/compiler/legacyDumiIds.ts`
- Create: `site/compiler/inventory.test.ts`
- Create: `site/compiler/legacyDumiIds.test.ts`
- Create: `scripts/docs-inventory.ts`
- Create: `site/content/compatibility.json`
- Modify: `scripts/clean.ts`
- Modify: `.dumirc.ts`
- Modify: `.gitignore`

**Interfaces:**

- Produces `packageNamespaces: readonly string[]` for package cleanup, dumi coexistence, and later Vite aliases.
- Produces `buildDocumentationInventory(root: string): DocumentationInventory`.
- Produces `createLegacyDemoId(input: LegacyDemoIdInput): string` matching dumi 2.4.41.
- Produces the committed `site/content/compatibility.json` consumed by later route and demo tasks.

- [ ] **Step 1: Write inventory and dumi-ID behavior tests**

```ts
import { resolve } from 'node:path';

import { buildDocumentationInventory } from './inventory';
import { createLegacyDemoId } from './legacyDumiIds';

describe('documentation inventory', () => {
  it('selects public source docs while excluding internal specifications', () => {
    const inventory = buildDocumentationInventory(resolve(import.meta.dirname, '../..'));

    expect(inventory.documents).toHaveLength(160);
    expect(inventory.demoReferences).toHaveLength(367);
    expect(inventory.documents.some(({ source }) => source.includes('/superpowers/'))).toBe(false);
  });

  it('preserves duplicate-source demos as separate legacy aliases', () => {
    const inventory = buildDocumentationInventory(resolve(import.meta.dirname, '../..'));
    const aliases = inventory.demoReferences.filter(
      ({ source }) => source === 'src/base-ui/DropdownMenu/demos/index.tsx',
    );

    expect(new Set(aliases.map(({ legacyId }) => legacyId)).size).toBe(aliases.length);
  });
});

describe('createLegacyDemoId', () => {
  it.each([
    ['src/Button/index.md', './demos/index.tsx', undefined, 'src-button-demo-demos'],
    ['src/Form/index.md', './demos/SubmitFooter.tsx', undefined, 'src-form-demo-submitfooter'],
    [
      'src/mdx/FileTree/index.md',
      './demos/index.tsx',
      'File, FileTree, Folder',
      'file, filetree, folder-demo-demos',
    ],
  ])('matches dumi for %s', (document, source, atomId, expected) => {
    expect(createLegacyDemoId({ atomId, document, source })).toBe(expected);
  });
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `rtk bunx vitest run site/compiler/inventory.test.ts site/compiler/legacyDumiIds.test.ts`

Expected: FAIL because the compiler modules do not exist.

- [ ] **Step 3: Add the shared namespace and inventory types**

```ts
// config/packageNamespaces.ts
export const packageNamespaces = [
  'awesome',
  'brand',
  'chat',
  'color',
  'icons',
  'mdx',
  'mobile',
  'storybook',
  'base-ui',
] as const;
```

```ts
// site/compiler/types.ts
export interface DemoOptions {
  inline: boolean;
  isolated: boolean;
  layout: 'default' | 'center' | 'bare';
}

export interface DemoReference {
  document: string;
  legacyId: string;
  legacyRouteId: string;
  options: DemoOptions;
  pathname: string;
  source: string;
}

export interface DocumentRecord {
  category?: string;
  description?: string;
  legacyRouteId: string;
  pathname: string;
  section: string;
  source: string;
  title?: string;
}

export interface DocumentationInventory {
  demoReferences: DemoReference[];
  documents: DocumentRecord[];
}
```

- [ ] **Step 4: Implement AST-aware inventory and legacy ID derivation**

Implement `buildDocumentationInventory()` with `unified`, `remark-parse`, `remark-frontmatter`, and HTML-node parsing. Limit public input to `src/**/index.md`, `docs/index.md`, and `docs/changelog.md`; explicitly exclude `docs/superpowers/**`. Support all observed attributes: no option, `nopadding`, `noPadding`, `center`, `iframe`, `iframe nopadding`, and `inline`. Fail on unknown attributes, missing files, duplicate pathnames, or duplicate legacy IDs.

Use this public signature:

```ts
export interface LegacyDemoIdInput {
  atomId?: string;
  document: string;
  explicitId?: string;
  source: string;
}

export function createLegacyDemoId(input: LegacyDemoIdInput): string;
export function buildDocumentationInventory(root: string): DocumentationInventory;
```

- [ ] **Step 5: Generate and validate the frozen compatibility manifest**

```ts
// scripts/docs-inventory.ts
import { resolve } from 'node:path';

import { buildDocumentationInventory } from '../site/compiler/inventory';
import { writeCompatibilityManifest } from '../site/compiler/inventory';

const root = resolve(import.meta.dirname, '..');
const inventory = buildDocumentationInventory(root);
writeCompatibilityManifest(root, inventory);
```

Run: `rtk bunx tsx scripts/docs-inventory.ts`

Expected: `site/content/compatibility.json` contains 160 public route records and 367 unique demo records, and a second run produces no diff.

- [ ] **Step 6: Move package namespace ownership out of dumi**

Change both `scripts/clean.ts` and `.dumirc.ts` to import `packageNamespaces` from `config/packageNamespaces.ts`. Preserve `.dumirc.ts` only for comparison until Task 11.

- [ ] **Step 7: Run GREEN verification**

Run:

```bash
rtk bunx vitest run site/compiler/inventory.test.ts site/compiler/legacyDumiIds.test.ts
rtk bunx tsx scripts/docs-inventory.ts
rtk git diff --check
```

Expected: tests pass; the compatibility manifest is idempotent; no whitespace errors.

- [ ] **Step 8: Commit**

```bash
rtk git add config/packageNamespaces.ts site/compiler site/content/compatibility.json scripts/docs-inventory.ts scripts/clean.ts .dumirc.ts .gitignore
rtk git commit -m "🧱 feat(docs): freeze dumi compatibility inventory"
```

### Task 2: Establish the React Router static-site foundation

**Files:**

- Create: `react-router.config.ts`
- Create: `vite.config.ts`
- Create: `tsconfig.site.json`
- Create: `site/root.tsx`
- Create: `site/routes.ts`
- Create: `site/app/routes/home.tsx`
- Create: `site/app/routes/not-found.tsx`
- Create: `site/compiler/finalizeBuild.ts`
- Create: `site/compiler/finalizeBuild.test.ts`
- Create: `site/compiler/manifests.ts`
- Create: `site/compiler/vitePlugin.ts`
- Create: `site/styles/global.css`
- Create: `site/styles/tokens.css`
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `.gitignore`
- Modify: `.prettierignore`

**Interfaces:**

- Produces `getPrerenderPaths(): Promise<string[]>` backed initially by `/`; later tasks add only successfully compiled MDX and demo paths.
- Produces `finalizeDocumentationBuild({ clientDirectory, outputDirectory }): void`.
- Produces a working SPA dev command and root `dist/` static artifact.

- [ ] **Step 1: Write the static-output staging test**

```ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { finalizeDocumentationBuild } from './finalizeBuild';

it('stages the React Router client output at the root dist directory', () => {
  const root = resolve(import.meta.dirname, '__fixtures__/finalize');
  const client = resolve(root, 'build/client');
  const output = resolve(root, 'dist');
  mkdirSync(client, { recursive: true });
  writeFileSync(resolve(client, 'index.html'), '<h1>Lobe UI</h1>');
  writeFileSync(resolve(client, '__spa-fallback.html'), '<div id="app"></div>');

  finalizeDocumentationBuild({ clientDirectory: client, outputDirectory: output });

  expect(readFileSync(resolve(output, 'index.html'), 'utf8')).toContain('Lobe UI');
  expect(readFileSync(resolve(output, '__spa-fallback.html'), 'utf8')).toContain('app');
});
```

- [ ] **Step 2: Run the staging test and verify RED**

Run: `rtk bunx vitest run site/compiler/finalizeBuild.test.ts`

Expected: FAIL because `finalizeBuild.ts` does not exist.

- [ ] **Step 3: Install the pinned site toolchain without a lockfile**

Run:

```bash
rtk pnpm add -D react-router@7.18.1 @react-router/dev@7.18.1 vite@7.3.6 @mdx-js/rollup@3.1.1 vite-tsconfig-paths@6.1.1 @types/node@24.13.3 react-live@4.1.8 pagefind@1.5.2 @playwright/test@1.61.1 rollup-plugin-visualizer@7.0.1 remark-frontmatter remark-mdx-frontmatter yaml
```

Expected: `package.json` changes and no lockfile is created.

- [ ] **Step 4: Add React Router and Vite configuration**

```ts
// react-router.config.ts
import type { Config } from '@react-router/dev/config';

import { getPrerenderPaths } from './site/compiler/manifests';

export default {
  appDirectory: 'site',
  buildDirectory: '.react-router/build',
  prerender: async () => getPrerenderPaths(),
  routeDiscovery: { mode: 'initial' },
  ssr: false,
} satisfies Config;
```

```ts
// vite.config.ts
import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { lobeDocs } from './site/compiler/vitePlugin';

export default defineConfig({
  plugins: [
    lobeDocs(),
    mdx(),
    reactRouter(),
    tsconfigPaths(),
    process.env.ANALYZE
      ? visualizer({ filename: '.react-router/build/client/stats.html' })
      : undefined,
  ],
});
```

- [ ] **Step 5: Add the root route and static route config**

```ts
// site/routes.ts
import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('./app/routes/home.tsx'),
  route('*', './app/routes/not-found.tsx'),
] satisfies RouteConfig;
```

Implement `site/root.tsx` with `Links`, `Meta`, `Outlet`, `Scripts`, and `ScrollRestoration`. Export `Layout`, `ErrorBoundary`, `links`, and the default root component. The initial home route renders a static `Lobe UI documentation migration` heading so the build is independently testable.

- [ ] **Step 6: Implement staged build finalization**

```ts
export interface FinalizeBuildOptions {
  clientDirectory: string;
  outputDirectory: string;
}

export function finalizeDocumentationBuild({
  clientDirectory,
  outputDirectory,
}: FinalizeBuildOptions): void {
  rmSync(outputDirectory, { force: true, recursive: true });
  cpSync(clientDirectory, outputDirectory, { recursive: true });
  copyFileSync(
    resolve(outputDirectory, '__spa-fallback.html'),
    resolve(outputDirectory, '404.html'),
  );
}
```

Add a guarded CLI entry that invokes the function with `.react-router/build/client` and `dist` only when `finalizeBuild.ts` is the executed program. Importing the function in Vitest must not touch the repository `dist/` directory.

Create the initial manifest and plugin boundaries:

```ts
// site/compiler/manifests.ts
export async function getPrerenderPaths(): Promise<string[]> {
  return ['/'];
}
```

```ts
// site/compiler/vitePlugin.ts
import type { Plugin } from 'vite';

export function lobeDocs(): Plugin {
  return { name: 'lobe-docs' };
}
```

- [ ] **Step 7: Add site scripts and TypeScript boundaries**

Add temporary coexistence scripts:

```json
{
  "site:build": "react-router build && tsx site/compiler/finalizeBuild.ts",
  "site:dev": "react-router dev",
  "site:typegen": "react-router typegen"
}
```

Create `tsconfig.site.json` extending the root config and including `site`, `vite.config.ts`, and `react-router.config.ts`. Add `engines.node: ">=22.12.0"`. Ignore `.react-router/` and site compiler caches.

- [ ] **Step 8: Run foundation verification**

Run:

```bash
rtk bun run site:typegen
rtk bunx tsc --noEmit -p tsconfig.site.json
rtk bunx vitest run site/compiler/finalizeBuild.test.ts
rtk bun run site:build
rtk rg -n "Lobe UI documentation migration" dist/index.html
```

Expected: all commands pass; `dist/index.html`, `dist/404.html`, and `dist/__spa-fallback.html` exist.

- [ ] **Step 9: Commit**

```bash
rtk git add package.json react-router.config.ts vite.config.ts tsconfig.site.json tsconfig.json site .gitignore .prettierignore
rtk git commit -m "🏗️ feat(docs): establish static site foundation"
```

### Task 3: Compile MDX documents into routes and navigation

**Files:**

- Create: `site/types/content.ts`
- Create: `site/compiler/content/discoverDocuments.ts`
- Create: `site/compiler/content/validateFrontmatter.ts`
- Create: `site/compiler/content/createManifest.ts`
- Create: `site/compiler/content/createManifest.test.ts`
- Create: `site/content/navigation.ts`
- Create: `site/app/content/registry.ts`
- Create: `site/app/mdx-components.tsx`
- Create: `site/app/routes/document.tsx`
- Create: `site/components/DocsLayout/DocsLayout.tsx`
- Create: `site/components/DocsLayout/DocsLayout.css`
- Create: `tests/fixtures/site/content/valid.mdx`
- Create: `tests/fixtures/site/content/invalid.mdx`
- Rename: `docs/index.md` to `docs/index.mdx`
- Rename: `docs/changelog.md` to `docs/changelog.mdx`
- Modify: `site/routes.ts`
- Modify: `site/compiler/manifests.ts`
- Modify: `vite.config.ts`

**Interfaces:**

- Produces `ContentFrontmatter`, `DocumentManifestEntry`, and `NavigationSection`.
- Produces `createContentManifest(root: string): ContentManifest`.
- Produces `loadDocument(pathname: string): Promise<MDXModule>` with per-document dynamic imports.

- [ ] **Step 1: Write manifest validation tests**

```ts
it('derives stable paths and navigation from MDX frontmatter', () => {
  const manifest = createContentManifest(fixtureRoot);
  expect(manifest.documents[0]).toMatchObject({
    category: 'General',
    pathname: '/components/button',
    title: 'Button',
  });
});

it('reports every invalid document in one actionable diagnostic set', () => {
  expect(() => createContentManifest(invalidFixtureRoot)).toThrow(
    /invalid\.mdx.*description.*category/s,
  );
});
```

- [ ] **Step 2: Run the manifest test and verify RED**

Run: `rtk bunx vitest run site/compiler/content/createManifest.test.ts`

Expected: FAIL because content compiler files do not exist.

- [ ] **Step 3: Define content types and frontmatter validation**

```ts
export type DocumentStatus = 'stable' | 'beta' | 'experimental' | 'deprecated';

export interface ContentFrontmatter {
  category?: string;
  description: string;
  order?: number;
  route?: string;
  since?: string;
  status?: DocumentStatus;
  title: string;
}

export interface DocumentManifestEntry extends ContentFrontmatter {
  pathname: string;
  source: string;
}
```

Collect validation failures and throw one diagnostic containing every file and missing/invalid field. Do not require `category` for homepage or changelog.

- [ ] **Step 4: Implement the MDX manifest and lazy registry**

Use `import.meta.glob('/src/**/index.mdx')` and explicit `docs/index.mdx`/`docs/changelog.mdx` imports. Cache each import promise by pathname so React 19 `use()` does not receive a new promise on rerender. The registry must expose only metadata synchronously and load the MDX module on demand.

```ts
export interface MDXModule {
  default: React.ComponentType;
  frontmatter: ContentFrontmatter;
}

export function loadDocument(pathname: string): Promise<MDXModule>;
```

- [ ] **Step 5: Add the generic document route**

Register `components/*` and `changelog` with `site/app/routes/document.tsx`. Resolve the pathname against the manifest, render the lazily loaded MDX component inside `DocsLayout`, and throw a 404 response for unknown manifest paths. Export route metadata from the manifest description and canonical pathname.

- [ ] **Step 6: Convert the homepage and changelog**

Move homepage JSX into `docs/index.mdx`. Replace the changelog `<embed>` with an MDX module import of `../CHANGELOG.md` and render `<Changelog />` so the prose is present in prerendered HTML. Configure the MDX Rollup plugin for both `.md` and `.mdx`, but expose only the explicit public registry; exclude `docs/superpowers/**` from discovery.

- [ ] **Step 7: Verify MDX route behavior**

Run:

```bash
rtk bunx vitest run site/compiler/content/createManifest.test.ts
rtk bun run site:typegen
rtk bunx tsc --noEmit -p tsconfig.site.json
rtk bun run site:build
rtk rg -n "Start building your AIGC app now" dist/index.html
rtk rg -n "Changelog" dist/changelog/index.html
```

Expected: MDX tests and types pass; homepage and changelog prose are statically rendered.

- [ ] **Step 8: Commit**

```bash
rtk git add site docs/index.mdx docs/changelog.mdx docs/index.md docs/changelog.md vite.config.ts
rtk git commit -m "📝 feat(docs): compile colocated MDX content"
```

### Task 4: Implement the approved shell, themes, and provider isolation

**Files:**

- Create: `site/app/providers/themeStore.ts`
- Create: `site/app/providers/themeStore.test.ts`
- Create: `site/app/providers/ThemeBootstrap.tsx`
- Create: `site/app/providers/SiteProviders.tsx`
- Create: `site/components/Header/Header.tsx`
- Create: `site/components/Header/Header.css`
- Create: `site/components/Sidebar/Sidebar.tsx`
- Create: `site/components/Sidebar/Sidebar.css`
- Create: `site/components/TableOfContents/TableOfContents.tsx`
- Create: `site/components/TableOfContents/TableOfContents.css`
- Create: `site/styles/tokens.css`
- Create: `site/styles/global.css`
- Modify: `site/root.tsx`
- Modify: `site/components/DocsLayout/DocsLayout.tsx`
- Modify: `src/ThemeProvider/type.ts`
- Modify: `src/ThemeProvider/ThemeProvider.tsx`
- Create: `src/ThemeProvider/ThemeProvider.test.tsx`

**Interfaces:**

- Produces `createThemeStore()` implementing `ThemeStore`.
- Adds optional `appId?: string` to `ThemeProviderProps`, preserving `LOBE_THEME_APP_ID` as the default.
- Produces responsive docs shell matching the approved Vercel × LobeHub visual baseline.

- [ ] **Step 1: Write theme and provider-isolation tests**

```ts
it('tracks system appearance without replacing the system preference', () => {
  const store = createThemeStore({ matchMedia, storage });
  store.setPreference('system');
  media.setMatches(true);
  expect(store.getSnapshot()).toEqual({ appearance: 'dark', preference: 'system' });
});

it('uses a caller-provided portal app id', () => {
  render(<ThemeProvider appId="demo-button">content</ThemeProvider>);
  expect(document.querySelector('#demo-button')).toHaveTextContent('content');
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `rtk bunx vitest run site/app/providers/themeStore.test.ts src/ThemeProvider/ThemeProvider.test.tsx`

Expected: FAIL because the store and `appId` prop do not exist.

- [ ] **Step 3: Implement the external-store theme contract**

```ts
export type ThemePreference = 'light' | 'system' | 'dark';
export type ResolvedAppearance = 'light' | 'dark';

export interface ThemeSnapshot {
  appearance: ResolvedAppearance;
  preference: ThemePreference;
}

export interface ThemeStore {
  getSnapshot(): ThemeSnapshot;
  setPreference(preference: ThemePreference): void;
  subscribe(listener: () => void): () => void;
}
```

Use one storage key in both the pre-hydration script and store. Set `document.documentElement.dataset.theme` and `style.colorScheme` before hydration.

- [ ] **Step 4: Add provider-specific app IDs**

Add `appId = LOBE_THEME_APP_ID` to `ThemeProvider` and use it for the wrapper ID. This preserves all existing callers while allowing independent demo environments to avoid duplicate IDs.

- [ ] **Step 5: Build the approved visual shell**

Implement the three-column desktop layout, medium-width TOC collapse, mobile navigation sheet, thin neutral borders, Geist typography, restrained spectral ambient accents, neutral functional surfaces, active/hover/focus states, and Light/Dark token parity. Use the approved design specification rather than the discarded exploratory mockups.

- [ ] **Step 6: Verify behavior and visual states**

Run:

```bash
rtk bunx vitest run site/app/providers/themeStore.test.ts src/ThemeProvider/ThemeProvider.test.tsx
rtk bunx tsc --noEmit -p tsconfig.site.json
rtk bun run site:build
```

Then use the local-testing skill to inspect Light, Dark, active navigation, hover navigation, desktop, and mobile layouts with no hydration or console errors.

- [ ] **Step 7: Commit**

```bash
rtk git add site src/ThemeProvider
rtk git commit -m "💄 feat(docs): implement LobeHub documentation shell"
```

### Task 5: Add lazy canonical demo descriptors and frames

**Files:**

- Create: `site/types/demo.ts`
- Create: `site/types/demo-imports.d.ts`
- Create: `site/compiler/demo/demoPlugin.ts`
- Create: `site/compiler/demo/demoPlugin.test.ts`
- Create: `site/compiler/demo/demoAnalysis.ts`
- Create: `site/compiler/demo/demoAnalysis.test.ts`
- Create: `site/components/Demo/Demo.tsx`
- Create: `site/components/Demo/CanonicalPreview.tsx`
- Create: `site/components/Demo/CanonicalPreview.test.tsx`
- Create: `site/components/Demo/DemoEnvironment.tsx`
- Create: `site/components/Demo/DemoErrorBoundary.tsx`
- Create: `site/components/Demo/DemoErrorBoundary.test.tsx`
- Create: `site/components/Demo/Demo.css`
- Create: `tests/fixtures/site/demos/simple.tsx`
- Create: `tests/fixtures/site/demos/local-import.tsx`
- Create: `tests/fixtures/site/demos/helper.ts`
- Create: `tests/fixtures/site/demos/browser-only.tsx`
- Modify: `site/app/mdx-components.tsx`
- Modify: `site/compiler/vitePlugin.ts`

**Interfaces:**

- Produces the approved `DemoModule`, `DemoProps`, `DemoLayout`, and `DemoAppearance` interfaces.
- Produces `analyzeDemo(sourcePath: string): DemoAnalysis` and a Vite `?demo` transform.
- Produces canonical preview, independent provider environment, and per-demo error isolation.

- [ ] **Step 1: Write lazy-descriptor and canonical-preview tests**

```ts
it('keeps the demo and editable scope lazy', async () => {
  const descriptor = await loadTransformedDescriptor('simple.tsx?demo');
  expect(executionLog).toEqual([]);
  await descriptor.load();
  expect(executionLog).toEqual(['simple']);
  expect(scopeLog).toEqual([]);
});

it('renders a deterministic placeholder before hydration', () => {
  const html = renderToString(<CanonicalPreview demo={descriptor} />);
  expect(html).toContain('data-demo-placeholder');
  expect(load).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `rtk bunx vitest run site/compiler/demo site/components/Demo`

Expected: FAIL because the demo compiler and components do not exist.

- [ ] **Step 3: Define the descriptor contract**

```ts
export interface DemoModule {
  editable: boolean;
  id: string;
  legacyIds: string[];
  load: () => Promise<ComponentType>;
  loadScope: () => Promise<Record<string, unknown>>;
  routeId: string;
  source: string;
  sourcePath: string;
}

export interface DemoProps {
  description?: string;
  editable?: boolean;
  height?: number | string;
  isolated?: boolean;
  layout?: 'default' | 'center' | 'bare';
  of: DemoModule;
  title?: string;
}
```

- [ ] **Step 4: Implement `?demo` without eager module evaluation**

Generate descriptor code whose `load()` dynamically imports only the selected demo and whose `loadScope()` dynamically imports a separate virtual scope module. Include every legacy alias from `compatibility.json`. Static analysis must classify dynamic imports, workers, and unsupported dependency graphs as requiring explicit read-only use; it must not silently change `editable`.

- [ ] **Step 5: Implement canonical preview and isolated errors**

Render a deterministic server placeholder. After hydration, use `React.lazy` to call `descriptor.load()`. Wrap each preview in its own resettable error boundary and provider stack:

```tsx
<ConfigProvider motion={motion}>
  <ThemeProvider appId={`lobe-demo-${demo.id}`} appearance={appearance}>
    <DemoComponent />
  </ThemeProvider>
</ConfigProvider>
```

One failed demo must not unmount sibling demos.

- [ ] **Step 6: Run GREEN verification**

Run:

```bash
rtk bunx vitest run site/compiler/demo site/components/Demo
rtk bunx tsc --noEmit -p tsconfig.site.json
rtk bun run site:build
```

Expected: descriptor imports remain lazy; placeholder HTML builds; demo failures stay local.

- [ ] **Step 7: Commit**

```bash
rtk git add site tests/fixtures/site/demos
rtk git commit -m "🧩 feat(docs): add lazy canonical demos"
```

### Task 6: Add react-live editing and legacy standalone demo routes

**Files:**

- Create: `site/compiler/demo/liveTransform.ts`
- Create: `site/compiler/demo/liveTransform.test.ts`
- Create: `site/components/Demo/LiveEditor.tsx`
- Create: `site/components/Demo/LiveEditor.test.tsx`
- Create: `site/components/Demo/DemoToolbar.tsx`
- Create: `site/components/Demo/StandaloneDemoPage.tsx`
- Create: `site/app/routes/standalone-demo.tsx`
- Create: `site/app/routes/standalone-demo.test.tsx`
- Create: `site/compiler/demo/readLegacyMap.ts`
- Create: `tests/fixtures/site/demos/dynamic-import.tsx`
- Create: `tests/fixtures/site/demos/throws.tsx`
- Modify: `site/routes.ts`
- Modify: `site/components/Demo/Demo.tsx`
- Modify: `site/compiler/manifests.ts`

**Interfaces:**

- Produces `transformLiveSource(source, immutableImports): LiveTransformResult`.
- Produces a lazy `LiveEditor` that retains the last successful element.
- Produces `/~demos/:demoId` resolution based exclusively on frozen IDs.

- [ ] **Step 1: Write live-transform and legacy-route tests**

```ts
it('turns a default component export into a rendered DemoEntry', () => {
  expect(transformLiveSource(source, imports)).toEqual({
    code: expect.stringContaining('render(<DemoEntry />)'),
    ok: true,
  });
});

it('rejects edited imports with a source location', () => {
  expect(transformLiveSource(changedImportSource, imports)).toMatchObject({
    diagnostics: [{ line: 1, message: expect.stringContaining('Imports are read-only') }],
    ok: false,
  });
});

it('resolves by legacy demo id and treats routeId as metadata only', () => {
  expect(resolveStandaloneDemo('src-button-demo-demos', 'wrong/route')).toMatchObject({
    sourcePath: 'src/Button/demos/index.tsx',
  });
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `rtk bunx vitest run site/compiler/demo/liveTransform.test.ts site/components/Demo/LiveEditor.test.tsx site/app/routes/standalone-demo.test.tsx`

Expected: FAIL because live editing and the standalone route do not exist.

- [ ] **Step 3: Implement the live transform with the TypeScript compiler AST**

Remove type-only and runtime imports after verifying they match the immutable import set. Rename default arrow/function/class component exports to `DemoEntry`, preserve hooks inside the component body, and append `render(<DemoEntry />)`. Return structured diagnostics rather than throwing.

```ts
export interface LiveDiagnostic {
  column?: number;
  line?: number;
  message: string;
}

export type LiveTransformResult =
  { code: string; ok: true } | { diagnostics: LiveDiagnostic[]; ok: false };
```

- [ ] **Step 4: Implement the lazy editor and last-successful preview**

Use `lazy(() => import('./LiveEditor'))`. Load `react-live` and `descriptor.loadScope()` only after the editor expands. Keep imports read-only, retain the last successful element when compilation fails, render inline diagnostics, and implement Reset from `descriptor.source`.

- [ ] **Step 5: Implement standalone and isolated rendering**

Register `route('~demos/:demoId', './app/routes/standalone-demo.tsx')`. Resolve by `params.demoId`, accept decoded `routeId` for metadata, emit `noindex`, and render the canonical demo directly without documentation chrome. Embedded `isolated` demos use this route in an iframe and must not recursively create another iframe.

- [ ] **Step 6: Verify representative complex behavior**

Run focused tests, then exercise `src/Flex/demos/basic.tsx`, `src/Button/demos/index.tsx`, a relative-helper demo, `src/i18n/demos/DynamicImport.tsx` as read-only, and an existing iframe demo.

- [ ] **Step 7: Commit**

```bash
rtk git add site tests/fixtures/site/demos
rtk git commit -m "✨ feat(docs): add live and standalone demos"
```

### Task 7: Generate TypeScript API references

**Files:**

- Create: `site/types/api.ts`
- Create: `site/compiler/api/createProgram.ts`
- Create: `site/compiler/api/resolveExport.ts`
- Create: `site/compiler/api/extractComponent.ts`
- Create: `site/compiler/api/renderType.ts`
- Create: `site/compiler/api/diagnostics.ts`
- Create: `site/compiler/api/extractComponent.test.ts`
- Create: `site/compiler/api/apiDiagnostics.test.ts`
- Create: `site/components/Api/Api.tsx`
- Create: `site/components/Api/Api.css`
- Create: `tests/fixtures/site/api/barrel.ts`
- Create: `tests/fixtures/site/api/component.tsx`
- Create: `tests/fixtures/site/api/inherited.ts`
- Create: `tests/fixtures/site/api/ambiguous.ts`
- Modify: `site/app/mdx-components.tsx`
- Modify: `site/compiler/vitePlugin.ts`

**Interfaces:**

- Produces `extractComponentApi(request: ApiRequest): ApiComponent`.
- Resolves the requested export from the nearest component barrel unless `from` is explicit.
- Produces a statically rendered `<Api name="..." from="..." />` component.

- [ ] **Step 1: Write public-export and diagnostic tests**

```ts
it('extracts props from the callable public export', () => {
  expect(extractComponentApi(request)).toMatchObject({
    name: 'Button',
    properties: expect.arrayContaining([
      expect.objectContaining({ name: 'loading', required: false, type: 'boolean' }),
    ]),
  });
});

it('explains an ambiguous export and requires from', () => {
  expect(() => extractComponentApi(ambiguousRequest)).toThrow(/ambiguous\.mdx.*Button.*from=/s);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `rtk bunx vitest run site/compiler/api`

Expected: FAIL because the API compiler does not exist.

- [ ] **Step 3: Define API metadata and compiler ownership**

Use the `ApiRequest`, `ApiComponent`, `ApiProperty`, and `ApiSourceLocation` interfaces from the design. Create one cached `ts.Program` from `tsconfig.json`, resolve aliases with `checker.getAliasedSymbol`, resolve props from the exported value's call signature, and render types with `TypeFormatFlags.NoTruncation`.

- [ ] **Step 4: Extract JSDoc and static defaults**

Collect description, `@default`, `@deprecated`, `@since`, inherited source, and declaration location. Add destructured initializer defaults only when the compiler can determine a literal safely. Never invent a default.

- [ ] **Step 5: Render the API table statically**

Render name, description, required state, type, default, deprecated/since badges, and inherited source. Mark the API region as Pagefind-indexable metadata while preserving accessible table semantics and responsive overflow.

- [ ] **Step 6: Run GREEN verification and a real component smoke test**

Run:

```bash
rtk bunx vitest run site/compiler/api
rtk bunx tsc --noEmit -p tsconfig.site.json
rtk bun run site:build
```

Expected: fixture tests pass and a pilot Button API table is present in prerendered HTML.

- [ ] **Step 7: Commit**

```bash
rtk git add site tests/fixtures/site/api
rtk git commit -m "📖 feat(docs): generate TypeScript API references"
```

### Task 8: Add static search, SEO, feedback, and artifact audits

**Files:**

- Create: `site/search/types.ts`
- Create: `site/search/pagefindEngine.ts`
- Create: `site/search/manifestEngine.ts`
- Create: `site/search/loadSearchEngine.ts`
- Create: `site/search/pagefindEngine.test.ts`
- Create: `site/components/Search/SearchDialog.tsx`
- Create: `site/components/Search/SearchDialog.css`
- Create: `site/components/Feedback/LazyGiscus.tsx`
- Create: `site/components/Analytics/Plausible.tsx`
- Create: `site/compiler/search/buildPagefind.ts`
- Create: `site/compiler/search/buildPagefind.test.ts`
- Create: `site/compiler/search/devPagefindPlugin.ts`
- Create: `site/compiler/seo/createSitemap.ts`
- Create: `site/compiler/seo/createSitemap.test.ts`
- Create: `site/types/pagefind.d.ts`
- Modify: `site/compiler/finalizeBuild.ts`
- Modify: `site/components/DocsLayout/DocsLayout.tsx`
- Modify: `site/root.tsx`

**Interfaces:**

- Produces `SearchEngine`, `SearchHit`, and lazy `loadSearchEngine()`.
- Produces `buildPagefind({ inputDirectory, outputDirectory }): Promise<void>`.
- Produces sitemap, robots, canonical metadata, `404.html`, and compatibility audit failures.

- [ ] **Step 1: Write search and sitemap behavior tests**

```ts
it('loads Pagefind result data and discards stale responses', async () => {
  const engine = createPagefindEngine(loadPagefind);
  const first = engine.search('but');
  const second = engine.search('button');
  resolveFirst(oldResults);
  resolveSecond(buttonResults);
  await expect(first).resolves.toEqual([]);
  await expect(second).resolves.toEqual([expect.objectContaining({ title: 'Button' })]);
});

it('excludes standalone demos from sitemap output', () => {
  const sitemap = createSitemap(['/components/button', '/~demos/src-button-demo-demos']);
  expect(sitemap).toContain('/components/button');
  expect(sitemap).not.toContain('/~demos/');
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `rtk bunx vitest run site/search site/compiler/search site/compiler/seo`

Expected: FAIL because search and SEO modules do not exist.

- [ ] **Step 3: Implement production and fallback engines**

The production engine dynamically imports `/pagefind/pagefind.js`, calls `init()` on focus, calls `preload()` while typing, and loads each result through `result.data()`. Render `plain_excerpt`, not raw HTML. On import/init/search failure, switch to manifest title/description/component-name matching.

- [ ] **Step 4: Integrate Pagefind in build and dev**

Use the Pagefind Node API. Production calls `addDirectory()` for the staged static artifact and writes files to `dist/pagefind`. Development builds an in-memory index from generated document HTML and serves the returned files through Vite middleware. Pagefind errors fail production builds.

- [ ] **Step 5: Add command-menu and feedback behavior**

Implement `Command/Ctrl + K`, focus trap, arrow navigation, Enter activation, Escape close, and trigger focus restoration. Lazy-load Giscus only near the viewport; exclude it and demo editors from Pagefind. Keep page-helpful controls separate. Preserve the current Plausible configuration (`ui.lobehub.com` and `https://plausible.lobehub-inc.cn`) as a production-only deferred script.

- [ ] **Step 6: Add final artifact audits**

After staging and Pagefind, generate sitemap and robots output, verify every compatibility route exists, verify every canonical document contains title/description, verify standalone pages contain `noindex`, verify internal links/anchors, and retain `.data` files and `__spa-fallback.html`.

- [ ] **Step 7: Run GREEN verification**

Run:

```bash
rtk bunx vitest run site/search site/compiler/search site/compiler/seo
rtk bun run site:build
rtk ls dist/pagefind
rtk rg -n "~demos" dist/sitemap.xml
```

Expected: tests pass; Pagefind assets exist; sitemap contains no standalone demo path.

- [ ] **Step 8: Commit**

```bash
rtk git add site
rtk git commit -m "🔍 feat(docs): add static search and artifact audits"
```

### Task 9: Build and verify the dumi-to-MDX codemod

**Files:**

- Create: `scripts/migrate-dumi-docs.ts`
- Create: `scripts/migrate-dumi-docs.test.ts`
- Create: `scripts/__fixtures__/migrate-dumi-docs/`

**Interfaces:**

- Produces `migrateDumiDocs({ check, root }): MigrationReport`.
- Converts all seven observed dumi demo-option combinations deterministically.
- Reports API/source-link overrides and missing descriptions without mutating the corpus in check mode.

- [ ] **Step 1: Write codemod behavior tests**

````ts
it('converts option variants without touching fenced examples', () => {
  const result = migrateFixture('option-variants');
  expect(result.output).toContain('import DemoIndex from');
  expect(result.output).toContain('<Demo of={DemoIndex} isolated layout="bare" />');
  expect(result.output).toContain('```md\n<code src="unchanged"></code>\n```');
});

it('is idempotent', () => {
  const first = migrateFixture('basic').output;
  const second = migrateSource(first).output;
  expect(second).toBe(first);
});
````

- [ ] **Step 2: Run codemod tests and verify RED**

Run: `rtk bunx vitest run scripts/migrate-dumi-docs.test.ts`

Expected: FAIL because the migration script does not exist.

- [ ] **Step 3: Implement AST-based migration**

Parse frontmatter and Markdown/MDX ASTs. Generate deterministic `?demo` imports in first-reference order. Convert `nopadding`/`noPadding`, `center`, `iframe`, and `inline`. Convert `group` to category while retaining category order separately. Extract `apiHeader`, `atomId`, `subType`, and homepage hero metadata before removing dumi-only fields. Replace changelog embed at compile time. Exclude `docs/superpowers/**`.

- [ ] **Step 4: Run the repository dry-run and inspect its complete report**

Run:

```bash
rtk bunx tsx scripts/migrate-dumi-docs.ts --check
```

Expected: the report describes 160 selected public docs, 367 demo conversions, 43 missing descriptions, 124 API sections, 79 API/source overrides, 35 isolated demos, and zero unknown attributes or missing sources. Check mode does not edit files.

- [ ] **Step 5: Run codemod fixture verification**

Run:

```bash
rtk bunx vitest run scripts/migrate-dumi-docs.test.ts
rtk git diff --check
```

Expected: all syntax, fence-safety, deterministic-import, and idempotence fixtures pass.

- [ ] **Step 6: Commit the codemod separately from generated content**

```bash
rtk git add scripts/migrate-dumi-docs.ts scripts/migrate-dumi-docs.test.ts scripts/__fixtures__
rtk git commit -m "🛠️ feat(docs): add deterministic MDX codemod"
```

### Task 10: Normalize and migrate the complete documentation corpus

**Files:**

- Create: `site/content/apiOverrides.ts`
- Modify/Rename: `src/**/index.md` to `src/**/index.mdx`
- Modify: `site/content/navigation.ts`
- Modify: `site/content/compatibility.json`

**Interfaces:**

- Produces 160 buildable public MDX documents with preserved routes, demo aliases, navigation order, source links, and deliberate API omissions.
- Leaves `docs/superpowers/**` as internal Markdown outside discovery.

- [ ] **Step 1: Author the missing content metadata**

Write accurate, component-specific descriptions for the 43 deficient pages. Resolve explicit API targets for the 124 existing API sections, including comma-separated `atomId` values. Encode all 79 `apiHeader` source/document link overrides in `site/content/apiOverrides.ts`. Do not create placeholder prose and do not insert API sections into the 34 deliberate omissions.

- [ ] **Step 2: Run write mode and verify idempotence**

Run:

```bash
rtk bunx tsx scripts/migrate-dumi-docs.ts --check
rtk bunx tsx scripts/migrate-dumi-docs.ts --write
rtk bunx tsx scripts/migrate-dumi-docs.ts --check
rtk rg -n "<code[^>]+src=|<embed" src docs --glob '*.mdx'
```

Expected: write mode converts 160 public documents; the second check reports no changes; residue search is empty outside literal specification examples.

- [ ] **Step 3: Run full compiler and route parity**

Run:

```bash
rtk bunx vitest run site/compiler scripts/migrate-dumi-docs.test.ts
rtk bun run site:build
rtk bunx tsx scripts/docs-inventory.ts --verify-migrated
rtk git diff --check
```

Expected: every frozen route/demo/source mapping resolves, all public content builds, and internal specifications remain unpublished.

- [ ] **Step 4: Commit the mechanical corpus migration**

```bash
rtk git add src docs/index.mdx docs/changelog.mdx site/content
rtk git commit -m "🚚 refactor(docs): migrate documentation to MDX"
```

### Task 11: Cut over scripts, CI, and remove dumi

**Files:**

- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `eslint.config.mjs`
- Modify: `.gitignore`
- Modify: `.prettierignore`
- Modify: `.github/workflows/test.yml`
- Modify: `.agents/skills/local-testing/SKILL.md`
- Modify: `src/awesome/SpotlightCard/demos/data.ts`
- Delete: `.dumirc.ts`
- Delete: obsolete `docs/index.tsx`

**Interfaces:**

- Public scripts `dev`, `docs:dev`, `docs:build`, `docs:build-analyze`, `start`, `setup`, and `type-check` point to the new site.
- CI builds and audits documentation without changing the library release build.
- No executable dumi reference remains.

- [ ] **Step 1: Write the cutover residue test**

```ts
it('contains no executable dumi coupling', () => {
  const findings = findExecutableDumiReferences(root);
  expect(findings).toEqual([]);
});
```

Place the behavior in `site/compiler/cutoverAudit.ts` and its test in `site/compiler/cutoverAudit.test.ts`. Exclude historical changelog prose and the approved design/plan documents from the audit.

- [ ] **Step 2: Run the residue test and verify RED**

Run: `rtk bunx vitest run site/compiler/cutoverAudit.test.ts`

Expected: FAIL with `.dumirc.ts`, package scripts/dependencies, TypeScript alias, ESLint exceptions, and visible demo copy.

- [ ] **Step 3: Switch public scripts and remove packages**

Use these final commands:

```json
{
  "dev": "react-router dev",
  "docs:build": "react-router build && tsx site/compiler/finalizeBuild.ts",
  "docs:build-analyze": "cross-env ANALYZE=1 bun run docs:build",
  "docs:dev": "react-router dev",
  "setup": "react-router typegen",
  "start": "bun run docs:dev",
  "type-check": "react-router typegen && tsc --noEmit && tsc --noEmit -p tsconfig.site.json"
}
```

Remove `dumi` and `dumi-theme-lobehub`; delete `.dumirc.ts`; remove `@@/*`, `.dumi`, and `.dumirc.ts` TypeScript/ESLint/ignore exceptions. Keep historical changelog mentions.

- [ ] **Step 4: Update CI and local testing ownership**

Add a documentation build gate to `.github/workflows/test.yml` after type/test verification. Update `.agents/skills/local-testing/SKILL.md` to use the Vite/React Router dev command, new port discovery, manifest-backed standalone demo paths, and new stable selectors.

- [ ] **Step 5: Run GREEN cutover verification**

Run:

```bash
rtk bunx vitest run site/compiler/cutoverAudit.test.ts
rtk bun run type-check
rtk bun run test -- --run
rtk bun run docs:build
rtk git diff --check
```

Expected: no executable dumi reference; library tests and full documentation build pass.

- [ ] **Step 6: Commit**

```bash
rtk git add package.json tsconfig.json eslint.config.mjs .gitignore .prettierignore .github/workflows/test.yml .agents/skills/local-testing/SKILL.md src/awesome/SpotlightCard/demos/data.ts site .dumirc.ts docs/index.tsx
rtk git commit -m "🔥 refactor(docs): remove dumi framework"
```

### Task 12: Add browser, prerender, bundle, and visual acceptance gates

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/site/docs.spec.ts`
- Create: `tests/site/visual.spec.ts`
- Create: `tests/site/prerender.test.ts`
- Create: `tests/site/bundle.test.ts`
- Create: `tests/site/fixtures.ts`
- Modify: `package.json`
- Modify: `.github/workflows/test.yml`

**Interfaces:**

- Produces automated acceptance coverage for direct routes, SPA navigation, themes, demos, search, focus, static HTML, and bundle boundaries.
- Produces visual baselines for approved state-specific screens.

- [ ] **Step 1: Write the end-to-end flows before enabling them in CI**

```ts
test('edits a demo, preserves the last good preview, and resets', async ({ page }) => {
  await page.goto('/components/button');
  await page.getByRole('button', { name: 'Show code' }).click();
  await expect(page.getByTestId('demo-preview')).toContainText('Get started');
  await page.getByRole('textbox', { name: 'Demo source' }).fill('invalid <');
  await expect(page.getByRole('alert')).toContainText('Unexpected token');
  await expect(page.getByTestId('demo-preview')).toContainText('Get started');
  await page.getByRole('button', { name: 'Reset source' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('preserves a legacy standalone demo URL', async ({ page }) => {
  await page.goto('/~demos/src-button-demo-demos?routeId=components%2FButton%2Findex');
  await expect(page.getByTestId('standalone-demo')).toBeVisible();
  await expect(page.locator('nav')).toHaveCount(0);
});
```

- [ ] **Step 2: Add prerender and bundle behavior tests**

Read built HTML and manifests. Assert that prose/API exist without executing JavaScript, standalone pages contain `noindex`, the initial documentation chunk does not contain `react-live` or `pagefind`, and unrelated demo source strings are absent.

- [ ] **Step 3: Run acceptance tests and fix product defects, not expectations**

Run:

```bash
rtk bun run docs:build
rtk bunx vitest run tests/site/prerender.test.ts tests/site/bundle.test.ts
rtk bunx playwright test tests/site/docs.spec.ts
```

Expected: all behavior gates pass with no console or hydration errors.

- [ ] **Step 4: Capture approved visual states**

Use Playwright screenshot assertions for Light/Dark component pages, hover/active navigation, collapsed/expanded editor, read-only demo, error state, search dialog, and desktop/tablet/mobile widths. Use the local-testing skill for a final human-visible browser review before accepting baselines.

- [ ] **Step 5: Run the complete release-equivalent verification**

Run:

```bash
rtk bun run ci
rtk bun run test:coverage
rtk bun run docs:build
rtk bunx playwright test
rtk git diff --check
```

Expected: every command succeeds; the working tree contains only intentional visual snapshots and test artifacts are ignored.

- [ ] **Step 6: Commit**

```bash
rtk git add playwright.config.ts tests/site package.json .github/workflows/test.yml
rtk git commit -m "✅ test(docs): cover static documentation platform"
```

## Final Verification Checklist

- [ ] `rtk rg -n "dumi|dumi-theme-lobehub|\.dumirc|<code[^>]+src=|<embed" package.json src docs site scripts .github eslint.config.mjs tsconfig.json` reports only intentional historical/specification prose.
- [ ] The frozen inventory verifies 160 public documents, 367 legacy demo aliases, 35 isolated demos, and zero missing sources.
- [ ] `rtk bun run ci` passes.
- [ ] `rtk bun run test:coverage` passes.
- [ ] `rtk bun run docs:build` produces root `dist/` with HTML, `.data`, assets, Pagefind, sitemap, robots, `404.html`, and `__spa-fallback.html`.
- [ ] `rtk bunx playwright test` passes all behavior and visual states.
- [ ] Hard refreshes work for `/`, a root component, every nested namespace class, a legacy encoded demo ID, changelog, and unknown route.
- [ ] JavaScript-disabled inspection shows document prose and API content.
- [ ] Initial document chunks exclude unrelated demos, `react-live`, and Pagefind.
- [ ] Light/System/Dark, independent demo theme, keyboard search, focus restoration, and mobile navigation pass.
- [ ] `rtk git diff --check` passes and no lockfile or generated build artifact is tracked.
