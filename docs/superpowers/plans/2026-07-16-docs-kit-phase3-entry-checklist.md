# Docs Kit — Phase 3 Entry Checklist (lobe-editor adoption)

Produced by the Phase 2 whole-branch review after walking lobe-editor's `.dumirc.ts` field by field. Spec: `2026-07-16-docs-kit-extraction-design.md` (Phase 3).

## Already expressible in docs.config.ts

`alias`; `atomDirs` + subType routing (`/components/react/editor` shape verified by fixture tests); `title`/`description`; `sitemap.hostname` → `siteUrl`; `favicons`; `giscus`; `analytics.plausible` (`scriptBaseUrl` → full-script `source`); `apiHeader` doc/source templates + `match`; `prefersColor` (`{default:'dark',switch:false}` → forced `'dark'` + hidden switcher); `metadata.openGraph.image`; `socialLinks` (discord/github).

## Gaps to close before/while migrating

1. **Package identity**: `@lobehub/ui` hardcoded in `pageChrome.ts` (importStatement, npmUrl), `demoPlugin.ts` (bare-import → src aliasing), `apiOverrides.ts`, and the whole `home.tsx`/BentoGallery/CodeShowcase hero. dumi expressed this as `apiHeader.pkg`; kit's `DocsApiHeaderConfig` has no `pkg`. Needs a first-class package-name config + consumer-provided (or configurable) home route.
2. **Branding/site shell**: Header `LobeHubText` wordmark + `'Lobe UI documentation home'` aria; Footer copyright epoch; lobe-ui-specific home page.
3. **`styles` global CSS injection**: editor injects transparent/dark body background; no config equivalent yet.
4. **Nav model reconciliation**: editor's dumi `nav` fully specifies top nav (Components → `/components/react/editor`, external UI/Icons, Changelog); kit currently auto-derives subType section tabs AND appends `navItems` — would duplicate/mislabel unless section-title mapping or nav override is added. Also make subType-section ordering deterministic here.
5. **`actions` variants**: `{github:true}` icon button and `type:'primary'` button; kit actions are plain text links.
6. **`.md` component docs**: `collectComponentDocuments` only picks `index.mdx`; editor atoms use `index.md`. Either `lobedocs migrate` converts, or discovery accepts `.md`.
7. **Changelog build-proof**: editor has no `docs/changelog.mdx`; fallback must be proven at MDX-compile/build level (Phase-2 final fix covers this — keep the fixture test green).
8. **API extraction vs editor exports**: verify TS extractor against multi-package exports; `apiOverrides.ts` is lobe-ui-shaped.
9. **`define: {'process.env': ...}`**: port editor demos to `import.meta.env` or add a define passthrough.
10. **`lastUpdated: true`**: no kit equivalent; decide drop or implement.

## Obsolete under vite (drop, no kit work)

`mfsu`; `jsMinifier: 'swc'`; `npmClient`; `extraBabelPlugins: ['babel-plugin-antd-style']`; commented-out `proxy`; single-entry `locales`; `base`/`publicPath` `'/'`.

## Carried follow-ups (non-blocking)

- Subprocess loader: already hardened (temp-file JSON) — done in Phase 2.
- `legacyRouteId` subType-prefix convention: validate against live dumi sitemap during the Phase 3 route-inventory diff gate.
- Repo URL duplicated between `apiHeader.github` and `socialLinks`: consider defaulting the former from the github socialLink.
- `THEME_STORAGE_KEY = 'lobe-ui-docs-theme'` in generic kit; stale-localStorage one-frame wrong paint under forced prefersColor.
- Demo SSR light-first flash for dark-site users (pre-paint scripts don't cover demo scope attribute).
- Header navItems/actions keyed by label (duplicate labels collide).
- navigation.ts specialSections skip is silent and pathname-keyed.
- document-modules virtual module evaluates changelog gate at load; adding/removing docs/changelog.mdx mid-dev needs restart (README note).
- atomRouting first-match on nested atomDirs (`src` before `src/react`) — longest-prefix or document.
- Two-layer signal handling README sentence; `:not(<complex>)` browser-support note; SunMoon icon for theme-Auto.
