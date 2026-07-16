# Docs Kit Extraction — Design Spec

Date: 2026-07-16
Status: Approved design, pending implementation plan

## Goal

Extract the lobe-ui documentation site (`site/`) into a reusable, installable package so other LobeHub repos — starting with `lobe-editor` — can replace dumi with the same React Router + Vite static-site stack. Feature scope is full dumi parity as used by these repos.

## Decisions (settled during brainstorming)

1. **Form**: an npm package (like dumi + dumi-theme-lobehub combined), not a central docs monorepo and not a copy-paste scaffold.
2. **Location**: lives in the lobe-ui repo as a workspace package first (`packages/docs-kit`); extraction to its own repo happens later, after the API stabilizes. lobe-ui itself is the first consumer (dogfooding).
3. **Capability scope**: parity with the dumi features actually used by lobe-ui and lobe-editor — including multi atomDirs, TS API extraction, giscus, changelog page, plausible analytics, sitemap/SEO, external nav links, dark-mode preference.
4. **Consumption model**: CLI wrapper (`lobedocs dev` / `lobedocs build`). The kit owns all vite/react-router configuration internally; consumer repos hold only `docs.config.ts` and content.

## Package Shape

- Path: `packages/docs-kit`
- npm name: `@lobehub/docs-kit`
- bin: `lobedocs`

Consumer-visible surface:

```
<repo>/
  docs.config.ts        # defineDocsConfig({...})
  package.json          # "docs:dev": "lobedocs dev", "docs:build": "lobedocs build"
  src/**/index.md(x)    # component docs, per configured atomDirs
  docs/**               # standalone guide pages
  CHANGELOG.md          # rendered by the changelog route when enabled
```

No `vite.config.ts` or `react-router.config.ts` in the consumer repo. The CLI drives react-router dev/build programmatically with kit-internal config, using the consumer repo as cwd/root.

## Configuration Surface (`docs.config.ts`)

Shape deliberately mirrors `.dumirc.ts` so migration is close to key-by-key transcription:

- `atomDirs: { dir: string; type?: string; subType?: string }[]` — multiple scan roots (lobe-editor: `src/react`, `src/plugins`, `src/renderer`; lobe-ui: `src`)
- `themeConfig`:
  - `nav` — items with internal links and external `override` links
  - `actions`, `socialLinks`
  - `giscus` — repo/repoId/category/categoryId
  - `analytics.plausible` — domain, scriptBaseUrl
  - `apiHeader` — docUrl/sourceUrl templates, match patterns, pkg name
  - `prefersColor` — default/switch
  - `metadata` / openGraph image, `description`, `name`, `title`
- `alias: Record<string, string>` — module aliases forwarded to vite
- `sitemap.hostname`, `favicons`, `title`, `description`
- `navSections` — replaces lobe-ui's hardcoded `navigationSections.json`; supplied per repo
- `legacyRedirects` — replaces lobe-ui's hardcoded `compatibility.json` (old dumi URL map); optional per repo

Config is loaded by the CLI and injected into the app shell via a vite virtual module.

## Internal Structure

The current `site/` tree moves into the package wholesale, then gets parameterized:

- `compiler/` — inventory (scan roots parameterized by `atomDirs` instead of hardcoded `src/`), demo pipeline, API extraction (existing TS extractor in `compiler/api/` serves as the `apiParser` equivalent), search indexing, SEO/sitemap, `finalizeBuild`
- `app/` — routes, providers, UI shell. Receives consumer config through virtual modules. `@lobehub/ui` becomes a regular dependency of the kit (not a peer)
- New capabilities (dumi parity gaps in the current site):
  - giscus comment component on doc pages, driven by `themeConfig.giscus`
  - changelog route rendering the consumer's `CHANGELOG.md`
  - plausible script injection driven by `themeConfig.analytics`
- `content/migration.ts` (existing dumi-markdown → site-format converter) is promoted to a CLI subcommand: `lobedocs migrate`, used to convert lobe-editor's dumi-flavored markdown

## Migration Path (4 phases)

### Phase 1 — Extract in lobe-ui

Move `site/` into `packages/docs-kit`; parameterize all hardcoded points (scan roots, site metadata, `navigationSections.json`, `compatibility.json`); add root `docs.config.ts`; switch scripts to `lobedocs dev` / `lobedocs build`. Gate: existing `cutoverAudit` tooling verifies route inventory and output parity against the pre-extraction build — no regressions allowed.

### Phase 2 — Editor-required capabilities

Multi atomDirs scanning + per-subType navigation grouping, giscus, changelog route.

### Phase 3 — lobe-editor adoption

Translate `.dumirc.ts` to `docs.config.ts`; run `lobedocs migrate` over its markdown; consume the kit via `file:` dependency initially. Gate: route inventory diffed against the live dumi site's sitemap.

### Phase 4 — Cleanup

Remove dumi, `.dumirc.ts`, and `.dumi/` from lobe-editor. Later, mechanically move `packages/docs-kit` to its own repo once stable.

## Testing

- The kit inherits all existing `site/` tests (compiler, routes, content).
- New integration fixture: a minimal fake consumer repo exercising multi atomDirs, giscus config, and changelog rendering, driven through the CLI entry points.
- Both cutovers (lobe-ui phase 1, lobe-editor phase 3) are gated by route-inventory diffs as described above.

## Out of Scope

- A central multi-project docs portal.
- Supporting dumi features neither repo uses.
- Immediate extraction to a standalone repo (phase 4, later).
