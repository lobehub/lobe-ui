# docs-kit Configurable Home Page

**Date:** 2026-07-17
**Status:** Approved
**Branch:** feat/docs-kit

## Problem

`packages/docs-kit/site/app/routes/home.tsx` hardcodes lobe-ui-specific content: the
"LobeHub UI Kit" hero title, six feature blurbs, the `bun add @lobehub/ui` install
command, the GitHub link, and CTA copy. Worse, `BentoGallery`, `CodeShowcase`, and
`HeroIconMarquee` import `@lobehub/ui` and `@lobehub/icons` directly, so any other
consumer of docs-kit cannot even build the home route. A generic documentation
framework must not ship another product's landing page.

## Solution

Two composable layers:

1. **Config-driven default page.** A new `themeConfig.home` block declaratively
   describes the hero, features, and install CTA. docs-kit's built-in home renders
   exclusively from `siteConfig` + `themeConfig.home` with zero hardcoded copy.
2. **Consumer-supplied page.** A new top-level `homePage` config field points at a
   consumer file that fully replaces the default page. lobe-ui uses this path and
   takes its bespoke showcase (bento, code showcase, icon marquee) back into its own
   repository.

When `homePage` is set it wins entirely; `themeConfig.home` is only read by the
default page.

## Design

### 1. Config surface (`packages/docs-kit/src/config.ts`)

```ts
export interface DocsHomeFeature {
  description: string;
  icon?: string;
  title: string;
}

export interface DocsHomeConfig {
  ctaFootnote?: string;
  ctaTitle?: string;
  features?: DocsHomeFeature[];
  hero?: {
    accent?: string;
    actions?: DocsNavItem[];
    title?: string;
  };
  install?: string;
}
```

- `DocsConfig` gains top-level `homePage?: string` — a build-time path relative to
  the consumer root, alongside `atomDirs` (not inside `themeConfig`, because it
  affects Vite module resolution, not runtime theming).
- `DocsThemeConfig` gains `home?: DocsHomeConfig`, shipped to the client through the
  existing `ClientSiteConfig.themeConfig` passthrough.

Semantics of `DocsHomeConfig`:

- `hero.title` defaults to `siteConfig.title`; `hero.accent` renders as a trailing
  gradient span after the title.
- `hero.actions` defaults to a single "Get Started" link targeting the first
  navigation section (current fallback behavior). External items reuse the existing
  `DocsNavItem` shape.
- `features` omitted → no features section. `icon` is a string key resolved through
  a curated lucide-react map (Palette, Zap, SunMoon, Languages, BookOpenText,
  Sparkles, and similar common names); unknown keys render no icon. No dynamic
  icon imports.
- `install` omitted → no install CTA section. `ctaTitle`/`ctaFootnote` are plain
  text; the "Get Started" link is appended to the footnote automatically.
- With a minimal config the default page degrades to hero-only and remains valid.

### 2. Virtual module (`site/compiler/vitePlugin.ts`)

- New id `virtual:lobedocs/home-page`. `resolveId` returns:
  - the absolute path of `resolve(root, config.homePage)` when `homePage` is set
    (the file must exist; fail the build with a clear error if not);
  - otherwise the built-in default component
    (`site/components/Home/DefaultHome.tsx`).
- `app/routes/home.tsx` becomes a thin shell: the existing `meta` function stays,
  the body imports the virtual module's default component and renders it inside the
  existing `<main>/<article>` chrome (pagefind attributes stay on the shell so both
  default and custom pages are indexed consistently).
- Because the custom page resolves to a real file path, Vite HMR works unmodified.
- Consumer files resolve imports through the existing `alias` config (this is how
  lobe-ui's page reaches `@lobehub/ui`).

### 3. Default home (`site/components/Home/DefaultHome.tsx`)

Renders purely from `siteConfig` and `themeConfig.home`:

- Hero: title + optional accent span, description from the `/` document or
  `siteConfig.description`, action buttons.
- Features grid via the curated icon map.
- Install CTA with the existing `CopyControl`.
- Reuses the styles now in `site/components/Home/homeStyle.ts`.

### 4. lobe-ui migration (repository root)

- New `docs/home/` directory receives, pixel-identical:
  - `docs/home/home.tsx` — the current `home.tsx` body (hero with
    "LobeHub UI Kit", GitHub button, marquee, bento, showcase, features, CTA);
  - `BentoGallery`, `CodeShowcase`, `HeroIconMarquee` with their style files;
  - a copy of `homeStyle.ts`.
- `docs.config.ts` adds `homePage: './docs/home/home.tsx'`.
- Delete the dead dumi-era `docs/index.tsx`.
- Remove the three showcase components (and their tests) from docs-kit; after the
  move, docs-kit source must have no `@lobehub/ui` / `@lobehub/icons` imports in
  home-related code.

### 5. Testing

- Config: parsing of `homePage` and `themeConfig.home` (including omission).
- vitePlugin: `virtual:lobedocs/home-page` resolution with and without `homePage`;
  missing-file error.
- `DefaultHome`: renders hero-only under minimal config; renders all sections under
  full config; unknown feature icon key renders without an icon.
- Existing home/showcase tests move with their components to the lobe-ui side.
- The lobe-ui site's rendered homepage is visually unchanged.

## Out of Scope

- MDX-driven home pages (option 3 from the discussion).
- Any redesign of the lobe-ui homepage content itself.
- i18n of home copy.
