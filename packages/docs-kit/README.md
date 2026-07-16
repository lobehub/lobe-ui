# @lobehub/docs-kit

A reusable documentation-site toolkit for LobeHub component libraries — a React Router + Vite static-site stack, packaged the way `dumi` + `dumi-theme-lobehub` used to be combined, but installable across repos.

`lobe-ui` is the first consumer (dogfooding): the site under `packages/docs-kit/site` compiles component docs, standalone demos, a search index, and a changelog page into a static build. Consumer repos hold only content and a config file — the kit owns every build tool config internally.

## Consumer surface

A repo adopting the kit needs:

```
<repo>/
  docs.config.ts        # defineDocsConfig({...})
  package.json           # "docs:dev": "lobedocs dev", "docs:build": "lobedocs build"
  src/**/index.md(x)     # component docs, per configured atomDirs
  docs/**                # standalone guide pages (docs/index.mdx -> "/", docs/changelog.mdx -> "/changelog")
  CHANGELOG.md            # rendered by the changelog route
```

No `vite.config.ts` in the consumer repo — the `lobedocs` CLI drives react-router dev/build programmatically using kit-internal config, with the consumer repo as cwd/root. A 1-line `react-router.config.ts` shell must still exist at the consumer root:

```ts
export { default } from './packages/docs-kit/site/react-router.config';
```

This is required because react-router 8.2 resolves `rootDirectory` and Vite's `root` to the same value with no way to split them via the public CLI, so `react-router.config.ts` discovery can't be redirected into the kit.

The package is workspace-internal for now (`"private": true`, no `exports` field) — `docs.config.ts` imports `defineDocsConfig` by relative path. Package-name imports (`@lobehub/docs-kit/config`) arrive once the kit is published, per the Phase 3+ roadmap below.

### CLI

```bash
lobedocs dev     # react-router dev server
lobedocs build   # react-router build + finalizeBuild (static artifact in dist/)
lobedocs typegen # react-router typegen
```

### `docs.config.ts`

```ts
import { defineDocsConfig } from './packages/docs-kit/src/config';

export default defineDocsConfig({
  atomDirs: [{ dir: 'src' }],
  title: 'Lobe UI',
  description: '...',
  siteUrl: 'https://ui.lobehub.com',
  navSections: {/* path -> nav section label */},
  themeConfig: {/* ... */},
});
```

| Field                                              | Type                                                 | Purpose                                                                                                  |
| -------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `atomDirs`                                         | `{ dir: string; type?: string; subType?: string }[]` | Scan roots for component docs (multiple roots support per-repo layouts, e.g. `src/react`, `src/plugins`) |
| `title` / `description`                            | `string`                                             | Site metadata, used in `<title>`/meta tags and OpenGraph                                                 |
| `siteUrl`                                          | `string`                                             | Canonical origin, used for sitemap/OG/canonical links                                                    |
| `navSections`                                      | `Record<string, string>`                             | Maps a doc source path to its nav section label (replaces `navigationSections.json`)                     |
| `legacyRedirects`                                  | `DocumentationInventory`                             | Optional old-URL -> new-URL redirect map (replaces `compatibility.json`)                                 |
| `alias`                                            | `Record<string, string>`                             | Module aliases forwarded to Vite                                                                         |
| `favicons`                                         | `Record<string, string>`                             | Favicon asset overrides                                                                                  |
| `themeConfig.navItems` / `actions` / `socialLinks` | `DocsNavItem[]` / `DocsSocialLink[]`                 | Header navigation, action buttons, social links                                                          |
| `themeConfig.giscus`                               | `{ repo, repoId, category, categoryId }`             | Giscus comments config                                                                                   |
| `themeConfig.analytics.plausible`                  | `{ domain, source }`                                 | Plausible analytics script injection                                                                     |
| `themeConfig.apiHeader`                            | `string`                                             | API doc header template                                                                                  |
| `themeConfig.prefersColor`                         | `'auto' \| 'dark' \| 'light'`                        | Default color scheme                                                                                     |
| `themeConfig.metadata.openGraph.image`             | `string`                                             | Default OG image                                                                                         |

Config is loaded once per process (out-of-process, via `node --import tsx`, to sidestep an esbuild/jsdom startup conflict — see the comment in `src/config.ts`) and injected into the app shell through Vite virtual modules.

## Internal structure

- `site/compiler/` — content inventory, demo pipeline, TS API extraction (`compiler/api/`), search indexing (Pagefind), SEO/sitemap, `finalizeBuild`
- `site/app/` — routes, providers, UI shell; receives consumer config via virtual modules
- `src/cli/` — `lobedocs` command implementations
- `src/config.ts` — `defineDocsConfig`, config loading/caching

## Roadmap

This package is at Phase 1 of a four-phase extraction (lobe-ui-only today, `lobe-editor` adoption later). See the full plan, including Phase 2's giscus/changelog/multi-atomDir work and Phase 3/4's `lobe-editor` migration, in
[`docs/superpowers/specs/2026-07-16-docs-kit-extraction-design.md`](../../docs/superpowers/specs/2026-07-16-docs-kit-extraction-design.md).
