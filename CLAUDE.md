# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@lobehub/ui` — an open-source React component library for AIGC web apps, plus `@lobehub/docs-kit` (in `packages/docs-kit`), the React Router + Vite documentation-site toolkit that builds this repo's own docs site (https://ui.lobehub.com). ESM-only, React 19, antd v6 as a peer dependency.

Package manager is **pnpm** (workspace: root + `packages/*`). Node >= 22.

## Commands

```bash
pnpm dev                  # docs dev server (lobedocs dev, from packages/docs-kit)
pnpm build                # tsdown → es/ + build packages
pnpm docs:build           # static docs site build

pnpm lint                 # eslint --fix (includes type-aware rules)
pnpm type-check           # lobedocs typegen + tsc --noEmit (lib + site tsconfigs)
pnpm lint:circular        # dpdm circular-dependency check
pnpm ci                   # lint:circular + lint + type-check

pnpm test                 # vitest watch (jsdom, globals)
pnpm vitest run <path>    # run a single test file
pnpm test:update          # update snapshots
```

Scope lint/type-check to changed files where possible; the full suite is slow.

## Architecture

### Component anatomy (`src/<ComponentName>/`)

Every top-level directory in `src/` with an `index.ts` becomes both a build entry and a docs "atom". A typical component:

```
src/Button/
  Button.tsx     # implementation
  index.ts       # export { default } from './Button'; export type * from './type';
  type.ts        # props types
  style.ts       # antd-style createStyles
  index.mdx      # docs page (compiled by docs-kit)
  demos/         # live demo components referenced from index.mdx
```

Tests are colocated as `*.test.ts(x)` next to source.

### Subpath entries

`src/` also holds namespace directories that map 1:1 to package exports (`@lobehub/ui/<name>`): `chat`, `base-ui`, `mdx`, `mobile`, `awesome`, `brand`, `color`, `icons`, `i18n`, `storybook`, `eslint`. New components in a namespace must be re-exported from that namespace's `index.ts`. `tsdown.config.ts` auto-discovers `src/*/index.ts` as entries — no config edit needed for new dirs.

`base-ui/` components are built on `@base-ui/react`; classic components use antd + `antd-style`.

### Styling & theming

- `antd-style` `createStyles` in `style.ts` files; theme tokens from `ThemeProvider` / `ConfigProvider` (`src/styles/`).
- Motion via the `motion` package, gated through `MotionProvider`.

### Docs site (`packages/docs-kit`)

- `docs.config.ts` at the repo root (`defineDocsConfig`) drives everything: `atomDirs` (component docs from `src/**/index.mdx`), `navigationSections.json` (sidebar), `compatibility.json` (legacy dumi-era URL redirects), `docs/` (standalone guide pages, `docs/home/home.tsx` is the landing page).
- The `lobedocs` CLI keeps the repo root as the React Router/Vite root and injects its own react-router config; the consumer repo needs no vite/react-router config files.
- Aliases in dev/test resolve `@lobehub/ui` and `@lobehub/ui/es/*` back to `src/` (see `docs.config.ts` and `vitest.config.ts`), so docs and tests run against source.

### Build output

`tsdown` emits unbundled ESM + `.d.mts` to `es/`; only `es/` is published. All runtime deps and peers are externalized.

## Conventions

- Commit messages use gitmoji style (enforced by commitlint), e.g. `🐛 fix(docs-kit): ...`, `✨ feat(ui): ...`. Releases are automated via semantic-release — never bump versions manually.
- The project `local-testing` skill covers browser verification of components/demos against the dev server.
