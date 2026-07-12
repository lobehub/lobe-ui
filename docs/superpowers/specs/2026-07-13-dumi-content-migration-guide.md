# Dumi → Document Content Migration Guide

**Date:** 2026-07-13  
**Status:** Reference for migrating other dumi-based component libraries  
**Companion design:** `docs/superpowers/specs/2026-07-11-dumi-replacement-design.md`  
**Reference implementation:** `@lobehub/ui` branch / work that replaced dumi with the project-owned Document site (`site/`)

---

## 1. Purpose

This guide captures **what must change in original documentation files** when a repository leaves dumi for the self-hosted Document stack (Vite + React Router + MDX + project compiler).

It separates:

| Layer                    | What it is                                                         | Reuse across repos          |
| ------------------------ | ------------------------------------------------------------------ | --------------------------- |
| **A. Document platform** | `site/`, Vite, React Router, compiler, search, chrome              | Framework / copy or extract |
| **B. Content migration** | `index.md` → `index.mdx`, demo protocol, API protocol, frontmatter | **Required in every repo**  |

Focus of this document: **layer B** — mechanical and reviewable transforms of colocated docs, plus the inventory and parity gates that make migration safe.

Platform design details remain in the companion design spec. Do not re-implement dumi syntax at runtime after migration.

---

## 2. Assumptions (typical Lobe-style package)

Source repos usually look like:

```text
src/
  Button/
    index.md          # dumi doc (public)
    index.ts
    Button.tsx
    demos/
      index.tsx
      Variant.tsx
  chat/
    ChatItem/
      index.md
      demos/
docs/
  index.md
  changelog.md
.dumirc.ts
```

Public surface for inventory (lobe-ui baseline):

- Colocated `src/**/index.md` (and nested package namespaces)
- Public `docs/*.md` (not internal specs such as `docs/superpowers/**`)
- dumi demo tags: `<code src="..." ...>`
- Optional hand-written API Markdown tables under `## API` / `## APIs`

Demos stay colocated. Do **not** move docs or demos out of component directories as part of this migration.

---

## 3. Target MDX protocol (after migration)

### 3.1 File layout

```text
src/<Component>/
  index.mdx           # was index.md
  demos/              # usually unchanged
  *.tsx
docs/
  index.mdx
  changelog.mdx
```

- Rename documentation to **explicit `.mdx`**.
- Any file with JSX or ES module imports must not keep a `.md` extension.
- Demo entry modules (`.tsx`) are left alone unless a specific demo cannot run under the new dual path (Vite preview + optional `react-live`).

### 3.2 Canonical document shape

```mdx
---
title: Button
description: Triggers an action or event.
category: General
order: 10
status: stable
---

import Basic from './demos/index.tsx?demo';
import Variants from './demos/Variant.tsx?demo';

## Usage

<Demo of={Basic} title="Default" layout="center" />

## Variants

<Demo of={Variants} />

## API

<Api name="Button" />
```

### 3.3 Frontmatter

| Field         | Requirement             | Purpose                                   |
| ------------- | ----------------------- | ----------------------------------------- |
| `title`       | Required                | Page and nav title                        |
| `description` | Required                | Intro, meta, search                       |
| `category`    | Required for components | Nav group                                 |
| `order`       | Optional                | Stable order within category              |
| `status`      | Optional                | stable / beta / deprecated / experimental |
| `since`       | Optional                | First package version                     |
| `route`       | Exceptional only        | Force a legacy public path                |

### 3.4 Global MDX components (Document)

Minimum global set:

- `Demo`
- `Api`
- Local MDX primitives as needed (`Callout`, `Steps`, `Tabs`, …)
- Standard Markdown via the docs typography layer

Arbitrary local imports remain valid; MDX is an executable module format.

---

## 4. Syntax conversion map (dumi → Document)

### 4.1 Demos

| dumi                           | Document                                                         |
| ------------------------------ | ---------------------------------------------------------------- |
| `<code src="./demos/x.tsx" />` | `import DemoX from './demos/x.tsx?demo'` + `<Demo of={DemoX} />` |
| `center`                       | `layout="center"`                                                |
| `nopadding` / `noPadding`      | `layout="bare"`                                                  |
| `iframe`                       | `isolated` (boolean on `<Demo />`)                               |
| `inline`                       | Normal embedded demo (no isolation)                              |
| (default padding)              | Default layout (omit or `layout="default"` per implementation)   |

**Import query `?demo`:** resolves to a descriptor (`id`, `load`, `loadScope`, `source`, `editable`), not an eager component. SSG must not execute the demo module; the real Vite module loads after hydration.

**Editing default:** demos are editable unless marked:

```mdx
<Demo of={ComplexDemo} editable={false} />
```

Use `editable={false}` when the example needs multi-file dynamic import, workers, large HTML fixtures, or behavior that cannot be safely represented in a `react-live` scope. Read-only demos still get preview, source, copy, standalone, and frame controls.

**Isolation:** map every dumi `iframe` demo to `isolated` so it keeps a separate document / stack boundary.

After migration, **no runtime parser** should accept dumi `<code src>` tags.

### 4.2 Frontmatter

| dumi                    | Document                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `nav`                   | Map into site nav / section model (config or derived)          |
| `group` / `group.title` | `category`                                                     |
| `group.order`           | `order` when meaningful                                        |
| `title`                 | `title`                                                        |
| `description`           | `description` (fill missing values before or during migration) |

Drop dumi-only keys once conversion is verified. Preserve public URL derivation; only set `route` when filesystem-derived paths would break existing links.

### 4.3 API sections

| Situation                                                   | Action                                              |
| ----------------------------------------------------------- | --------------------------------------------------- |
| Props table for a public export that TypeScript can resolve | Replace with `<Api name="ExportName" />`            |
| Non-props types, notes, Ant Design inheritance prose        | Keep as hand-written Markdown under the API heading |
| Intentionally empty API section                             | Record deliberate omission; do not invent tables    |
| Multiple tables under headings                              | One `<Api />` per export; keep non-matching tables  |

Optional migration-only attribute for codemod provenance / re-runs:

```mdx
<Api name="ActionIcon" migrationKey="heading:%5B%22ActionIcon%22%5D:0" />
```

`name` must match the public export the compiler resolves from the nearest package barrel (or an explicit `from` override in migration config).

### 4.4 Before / after (minimal)

**Before (`index.md`):**

```md
---
nav: Components
group:
  title: General
  order: -1
title: ActionIcon
description: Icon button with variants and tooltip support.
---

## Basic Usage

<code src="./demos/index.tsx" nopadding></code>

## Size

<code src="./demos/Size.tsx" center></code>

## APIs

### ActionIcon

| Property | Description  | Type      | Default |
| -------- | ------------ | --------- | ------- |
| active   | Active state | `boolean` | `false` |
```

**After (`index.mdx`):**

```mdx
---
title: ActionIcon
description: Icon button with variants and tooltip support.
category: General
---

import DemoIndex from './demos/index.tsx?demo';
import DemoSize from './demos/Size.tsx?demo';

## Basic Usage

<Demo of={DemoIndex} layout="bare" />

## Size

<Demo of={DemoSize} layout="center" />

## APIs

### ActionIcon

<Api name="ActionIcon" />
```

---

## 5. What usually does **not** change

- Component implementation under `src/**/*.tsx` (except small type/docs annotations; see §7)
- Demo business logic in `demos/**` (default case)
- Package public API of the library itself
- Colocation layout (`src/<Component>/demos`)

Touch demos only when:

- live edit / static analysis cannot load a dependency graph, or
- browser-only modules break SSG if accidentally eager-imported (should be fixed by `?demo` laziness, not by rewriting demos first).

---

## 6. Recommended migration workflow

### Phase 0 — Baseline inventory (authoritative)

Before rewriting files, freeze a report of:

1. Public document paths (`src/**/index.md`, public `docs/*.md`)
2. Public route pathnames (must stay stable)
3. Every `<code src>` reference: document, source path, attributes
4. Legacy standalone demo IDs (dumi algorithm) and `/~demos/:demoId?routeId=...` URLs
5. Documents missing `description`
6. API sections: present / empty / multi-table / unheaded tables

In lobe-ui this is `site/compiler/inventory.ts` + `scripts/docs-inventory.ts` → committed `site/content/compatibility.json`.

Treat inventory counts as a **build/CI gate**, not reconnaissance notes.

### Phase 1 — Platform skeleton (layer A)

Ship enough Document runtime to compile MDX, resolve `?demo`, render `<Demo>` / `<Api>`, prerender routes, and serve standalone demos. Content can still be dumi Markdown until Phase 2 if the inventory tool reads both; once codemod runs, dumi is obsolete.

### Phase 2 — Deterministic content codemod (layer B)

Preferred: one deterministic script (lobe-ui: `scripts/migrate-dumi-docs.ts`).

Capabilities:

| Transform   | Behavior                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Extension   | `*.md` → `*.mdx`, delete legacy only after successful write                                      |
| Frontmatter | Normalize to Document schema via per-doc config                                                  |
| Demo tags   | Emit unique `?demo` imports + `<Demo />` with layout/isolated flags                              |
| API         | Per-document disposition (replace / preserve / omit)                                             |
| Safety      | Fail on unknown demo attributes, missing demo files, destination conflicts, duplicate attributes |
| Modes       | `--check` (dry / CI) and `--write`                                                               |

Per-document review config (lobe-ui: `site/content/migration.ts`) should hold:

- `description` fill-ins
- `nav` / `category` / `categoryOrder` / `atomId` when derivation is wrong
- API disposition: `replace-all` | `replace-tables` | `preserve-all`
- API targets (`name`, optional `from`)
- Table selectors / `migrationKey` mapping
- Body SHA for preserved manual API sections (detect silent drift)
- `deliberateApiOmission` with reason
- Frozen inventory counters for CI invariants

Codemod must be **idempotent** under `--check` after a successful `--write`.

### Phase 3 — Human review pass

Walk blockers the script cannot invent:

1. **Missing descriptions** — write real one-line product descriptions (not placeholder stubs).
2. **API export names** — heading text vs export name (e.g. docs said `DropdownMenuV2`, public export is `DropdownMenu`).
3. **Preserved tables** — confirm non-props content should stay human-authored.
4. **Isolated demos** — every former `iframe` has `isolated`.
5. **Read-only demos** — mark `editable={false}` where live edit is wrong or flaky.
6. **Standalone-only demos** — demos referenced only via old URLs / not embedded: acknowledge or re-link.
7. **Nav grouping** — category labels match the product IA of the new shell.

### Phase 4 — Type annotations for API parity (optional but common)

If generated `<Api />` rows drop defaults that old tables showed, add **JSDoc `@default`** (and only when needed) on props interfaces so extraction matches reviewed tables. Prefer fixing types over hardcoding wrong tables.

Example:

```ts
export interface ExampleProps {
  /**
   * @default true
   */
  horizontal?: boolean;
}
```

Use compiler overrides (lobe-ui: `site/content/apiOverrides.ts`) only when TypeScript truth and product docs intentionally diverge after review.

### Phase 5 — Parity and freeze

Verify against the Phase 0 inventory:

- [ ] Document count and every public pathname
- [ ] Every inventoried demo reference still embeds
- [ ] Every frozen `/~demos/...` ID resolves to the same source file
- [ ] No remaining `<code src=` in public docs
- [ ] No remaining public `index.md` that should be MDX
- [ ] `description` present on all public component docs
- [ ] API dispositions resolved (no pending omit / replace without reason)
- [ ] `docs:build` / artifact audit green (routes, sitemap, noindex on standalone demos, search index)
- [ ] Codemod `--check` is clean (no `wouldChange`)

Remove dumi (`dumi`, theme, `.dumirc.ts`, setup scripts) only after parity gates pass.

---

## 7. Checklist for original-file edits

Use this as a per-repo PR checklist for content only.

### Required mechanical edits

- [ ] Rename public docs `index.md` → `index.mdx` (and public `docs/*.md`)
- [ ] Convert frontmatter to Document schema
- [ ] Replace every `<code src>` with `?demo` import + `<Demo />`
- [ ] Map layout attributes (`center` / `nopadding` / default)
- [ ] Map `iframe` → `isolated`
- [ ] Replace migratable API tables with `<Api name="..." />`
- [ ] Keep intentional non-props Markdown under API headings
- [ ] Ensure required `title` + `description` (+ `category` for components)

### Review edits

- [ ] Fill missing descriptions
- [ ] Correct `<Api name>` / barrel `from` for namespaced packages
- [ ] Set `editable={false}` where needed
- [ ] Confirm isolated demos still make sense visually
- [ ] Preserve or document deliberate API omissions
- [ ] Add `@default` JSDoc only where API extraction must match old tables
- [ ] Record overrides for reviewed exceptions

### Do not

- [ ] Leave dumi `<code src>` support in the new runtime
- [ ] Relocate demos “for cleanliness” during migration
- [ ] Snapshot entire route manifests as the only test (prefer behavior tests + inventory invariants)
- [ ] Put documentation-only tooling into the published package dependencies

---

## 8. Standalone demo URL compatibility

If external links or bookmarks used dumi standalone demos, preserve:

```text
/~demos/:demoId?routeId=<encoded-document-route>
```

Rules:

1. **Freeze** the mapping from legacy `demoId` → source file at migration time.
2. Re-implementing dumi’s ID algorithm forever is not enough; renames would break IDs. Commit the map.
3. New demos get deterministic IDs from source paths; legacy IDs remain aliases until an intentional break.
4. Standalone pages: demo shell only, `noindex`, excluded from sitemap.

Legacy ID derivation in lobe-ui lives in `site/compiler/legacyDumiIds.ts` (matched to dumi 2.4.41 for inventory generation).

---

## 9. lobe-ui reference inventory (example scale)

Frozen at migration time for this monorepo (illustrative; re-measure per repo):

| Metric                         | Count |
| ------------------------------ | ----- |
| Public documents               | 160   |
| Demo references                | 367   |
| Isolated (iframe) demos        | 35    |
| Initially missing descriptions | 43    |
| Legacy manual API sections     | 67    |
| Component API decisions        | 158   |

Scripts / config of record:

| Path                              | Role                                                  |
| --------------------------------- | ----------------------------------------------------- |
| `scripts/docs-inventory.ts`       | Generate / refresh compatibility inventory            |
| `scripts/migrate-dumi-docs.ts`    | Deterministic content codemod (`--check` / `--write`) |
| `site/content/compatibility.json` | Frozen routes + demo aliases                          |
| `site/content/migration.ts`       | Per-document migration metadata                       |
| `site/content/apiOverrides.ts`    | Reviewed API extraction overrides                     |
| `site/compiler/inventory.ts`      | Inventory builder                                     |
| `site/compiler/legacyDumiIds.ts`  | dumi-compatible demo id helper                        |

CLI shape:

```bash
# Inventory
tsx scripts/docs-inventory.ts

# Dry run / CI gate
tsx scripts/migrate-dumi-docs.ts --check

# Apply
tsx scripts/migrate-dumi-docs.ts --write
```

---

## 10. Cross-repo playbook (short form)

For the next package that still uses dumi:

1. **Copy or depend on** Document platform capabilities (or extract them once shared).
2. **Inventory** that repo’s docs/demos/routes; commit the freeze file.
3. **Author** `migration` config: nav map, descriptions, API dispositions.
4. **Run** codemod `--check` until blockers are config-fixed, then `--write`.
5. **Review** isolated / read-only demos and API name mapping.
6. **Parity gate** against inventory + build/search/standalone URLs.
7. **Delete** dumi config and dependencies.
8. **Keep** codemod `--check` in CI until the repo no longer contains legacy sources (optional long-term: drop codemod after a grace period; keep inventory invariants in the compiler).

---

## 11. Success criteria

Migration of original files is complete when:

1. All public component docs are valid Document MDX (no dumi demo dialect).
2. Frontmatter validates under the Document schema.
3. Every inventoried demo embeds or is explicitly acknowledged.
4. API sections are either generated, deliberately preserved, or deliberately omitted with reason.
5. Public documentation routes and frozen standalone demo URLs match the pre-migration inventory.
6. Production build is fully static for docs text/API; demos hydrate client-side without breaking prerender.
7. dumi is removable without content loss.

---

## 12. Out of scope for this guide

- Visual redesign of the docs shell (homepage, header, footer tokens)
- Changing component public APIs for product reasons
- i18n beyond the repo’s existing language scope
- Building a multi-repo published “docs framework” package (unless productized later)

When platform behavior and content protocol diverge, prefer updating this guide’s conversion tables and the design spec together so the next migration stays deterministic.
