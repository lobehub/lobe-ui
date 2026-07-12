# Docs Site Footer

**Date:** 2026-07-13
**Status:** Approved
**Mockup:** https://claude.ai/code/artifact/7cc0e08f-cfac-4dba-8e5f-6d8807b4c91d

## Goal

Add a site-wide footer to the documentation site, with content referencing the
bottom line of ui.lobehub.com (the previous dumi site). The slim variant was
chosen over a full four-column replica.

## Design

A single-row footer rendered on every page under the docs layout:

- **Left (colophon):** `Copyright © 2022–{currentYear} · Made with 🤯 by LobeHub`,
  where "LobeHub" links to https://lobehub.com (external).
- **Right (nav):** `GitHub ↗ · NPM ↗ · Changelog`
  - GitHub → https://github.com/lobehub/lobe-ui (external)
  - NPM → https://www.npmjs.com/package/@lobehub/ui (external)
  - Changelog → `/changelog` (internal react-router `Link`)
- External links open in a new tab (`rel="noreferrer" target="_blank"`) and
  carry a small ↗ affordance.

### Visual

- Hairline top border: `--docs-border-subtle`.
- Text: `--docs-text-subtle` at 0.8125rem; links lift to `--docs-text-primary`
  on hover/focus with a 140ms color transition.
- Width follows the page content column (same horizontal padding as the
  article body), not the full viewport.
- Below 47.5rem the two groups stack vertically, centered, with 0.75rem gap —
  matching the breakpoint used by the current home-page footer.

## Architecture

- New component `site/components/Footer/Footer.tsx` with co-located
  `site/components/Footer/style.ts`, following the existing site component
  pattern (e.g. `Header`, `Sidebar`): css-in-js via the site's `style.ts`
  convention, tokens from `site/styles/globalStyles.ts`.
- Mounted in `site/app/routes/docs-layout.tsx` immediately after `<Outlet />`,
  so it appears on home, changelog, component docs, and the not-found page.
  The standalone demo route (`~demos/:demoId`) sits outside this layout and is
  intentionally unaffected.
- The inline `<footer>` in `site/app/routes/home.tsx` and its `footer` style
  in `homeStyle.ts` are removed; the shared Footer replaces them.
- The footer is excluded from search indexing with `data-pagefind-ignore="all"`.

## Testing

- New `site/components/Footer/Footer.test.tsx` modeled on `Header.test.tsx`:
  - renders the copyright line with the current year
  - renders GitHub / NPM links with external attributes
    (`target="_blank"`, `rel` containing `noreferrer`)
  - renders Changelog as an internal link to `/changelog`
- Update any home-page tests that assert on the removed inline footer.

## Out of Scope

- Four-column footer (Resources / Community / Help / More Products).
- Reusing the library's `@lobehub/ui` Footer component (rc-footer based,
  mismatched with the slim design).
