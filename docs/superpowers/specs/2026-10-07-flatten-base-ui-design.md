# Flatten `src/base-ui` into `src/` (PR-6)

Date: 2026-10-07
Stacks on: #701 (`feat/stylex-core`) → #700 → #699 → #698 → #697 → #695 → #683 → #682
Branch: `feat/flatten-base-ui`

## Goal

The next major has one component set. Since #699 the root export already is the base-ui set; this PR makes the source tree and the package surface match:

- `src/base-ui/` is deleted. Every component lives at `src/<Name>/`.
- The package exposes `@lobehub/ui` and `@lobehub/ui/form` (FormKit). The `@lobehub/ui/base-ui` and `@lobehub/ui/base-ui/form` subpaths are removed, not aliased.
- Behaviour, styles and the root export's names are unchanged. This is a move.

It lands before StyleX stage B so the remaining style migrations work against final paths.

## 1. Layout

- The 63 component directories move with `git mv src/base-ui/<Name> src/<Name>` so history follows.
- Six names already exist at `src/` as one-line re-export shims (`export * from '@/base-ui/X'`): ContextMenu, DropdownMenu, Popover, ScrollArea, Toast, Tooltip. The shim `index.ts` is deleted and the real directory takes its place. ContextMenu, DropdownMenu and ScrollArea also have a root `index.mdx` and `demos/`; each pair becomes one `index.mdx` (the base-ui page is the source of truth; anything only the root page has is kept), and demo imports become `./demos/…`.
- Non-component modules move to `src/internal/`, names unchanged: `controlSize.ts`, `focusRing.ts`, `panelStyles.ts`, `SubmenuArrowIcon.tsx`, `floating/`, `menu/`, `virtual/`, `zIndex/`. `src/internal/` has no `index.ts`, so it is never a build entry or a subpath; whatever is public today stays re-exported from the root (e.g. `export * from './internal/menu'`).
- FormKit stays at `src/FormKit` (a lowercase `src/form` would collide with `src/Form` on case-insensitive filesystems); only its export path is `./form`.
- `src/base-ui/index.ts`'s `export *` list moves into `src/index.ts` as explicit per-directory exports. The root export name set must be identical before and after (§5).

## 2. Package surface and config

- `package.json` `exports`: remove `./base-ui` and `./base-ui/form`; add `./form` → `es/FormKit/index.mjs` / `.d.mts`.
- `tsdown.config.ts`: the explicit `src/base-ui/FormKit/index.ts` entry becomes `src/FormKit/index.ts`; auto-discovery picks up the moved `src/*/index.ts` dirs.
- `docs.config.ts`: alias `@lobehub/ui/base-ui/form` → `@lobehub/ui/form` (→ `src/FormKit`).
- `config/packageNamespaces.ts`: remove `base-ui`.
- `scripts/checkStylexBuild.ts`: checked module paths drop the `base-ui/` prefix.
- Codemod: `@/base-ui/<Name>` → `@/<Name>`, `@/base-ui/<internal>` → `@/internal/<internal>`, `@lobehub/ui/base-ui/form` → `@lobehub/ui/form`, `@lobehub/ui/base-ui` → `@lobehub/ui`, across `src`, `packages/docs-kit`, `docs`, `scripts`, tests and mdx. Relative imports inside moved files are fixed by type-check. Historical `docs/superpowers/{specs,plans}` files are not rewritten.

## 3. Docs URLs

- Component pages move from `/components/base-ui/<name>` to `/components/<name>`; `compatibility.json` entries for base-ui documents and demos are rewritten to the new paths.
- Old `/components/base-ui/*` URLs must keep working: use docs-kit's existing redirect mechanism if it has one; otherwise add a prefix redirect `/components/base-ui/<rest>` → `/components/<rest>` in docs-kit's routes. Standalone demo ids (`/~demos/<legacyId>`) change with the path; old ids redirect the same way if the mechanism allows, otherwise they're listed in the PR as changed.
- Sidebar/navigation: no separate base-ui grouping remains; pages keep their `category` front-matter.

## 4. Downstream migration

- `src/eslint` preset: importing `@lobehub/ui/base-ui` or `@lobehub/ui/base-ui/form` is an error with autofix to `@lobehub/ui` / `@lobehub/ui/form`. Existing preset tests are updated to the new paths, plus tests for the new rule's autofix.
- README / docs: no `base-ui` subpath mentions remain.
- Release notes (PR body): the two subpath changes and `eslint --fix` as the migration.

## 5. Verification

1. `pnpm type-check`, `pnpm lint:circular`, `pnpm vitest run src config`, eslint/stylelint on changed files, `pnpm build` (includes the StyleX output check).
2. Root export parity: the sorted export name list of `es/index.d.mts` before (on `feat/stylex-core`) and after must be identical; `es/FormKit/index.d.mts` exports must equal the old `es/base-ui/FormKit/index.d.mts`.
3. `git grep -n "base-ui" -- src packages/docs-kit docs/*.mdx README.md scripts config package.json tsdown.config.ts docs.config.ts` returns only `@base-ui/react` (the upstream library) and the new eslint rule.
4. Docs: every docs page and standalone demo route on the new URLs returns its page (title check, since 404s render with status 200); a sample of old `/components/base-ui/*` URLs redirects to the new page.
5. Screenshot diff of every standalone demo × light/dark, `feat/stylex-core` vs this branch (demo ids mapped old → new): 0 differences beyond the known timing-noise demos.

## Out of scope

- StyleX stage B (next PRs, against the new paths).
- Renaming components or changing any export name.
- Downstream repos' import rewrites (they run the eslint autofix when adopting the major).
