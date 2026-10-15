# Design token catalog and legacy cleanup

Date: 2026-10-15 · Branch: `v6` · Status: canvas reviewed; docs page shipped; Phase 2 (cleanup) not started

## Goal

Catalog every `--lobe-*` design token on a Claude Design canvas, show each surviving token inside the lobe-ui components that use it, and cut the token set down to what lobe-ui actually consumes. The antd-era bulk (including `token/legacy.ts`) goes away.

Trigger: dark-mode shadows rendered white because `legacy.ts` carried `colorShadow: rgba(255,255,255,0.2)` and eleven shadow strings pre-baked from it. Fixed at the source on 2026-10-14; the incident showed the token layer has no owner-visible inventory.

## Decisions

| #   | Decision                 | Choice                                                                                             |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| 1   | Where the artboards live | Claude Design canvas (Design artifact type)                                                        |
| 2   | Cleanup scope            | All ~785 tokens, not only `legacy.ts`                                                              |
| 3   | Survival rule            | A token survives only if a lobe-ui component uses it. Downstream apps migrate to the surviving set |
| 4   | Board layout             | Role-based target system (layout A)                                                                |
| 5   | Status tokens            | Exception to rule 3: a uniform 9-role × 4-status matrix                                            |

## Current inventory

Measured 2026-10-15 with `createLobeTokenGroups` (light + dark) and a static scan of `src/**/*.{ts,tsx,css,mdx}`. Excluded from "use": `src/styles/theme/**`, `src/styles/stylex/cssVar.stylex.ts`, `src/types/**`, `src/color/CssVar/**` (the token viewer), tests and snapshots. A use is `cssVar|token|theme.<key>` or the literal `--lobe-<kebab>` variable. The only dynamic key access in `src/` is the excluded viewer.

| Group                     | Total   | Used    | Unused  |
| ------------------------- | ------- | ------- | ------- |
| Hue scales (14 hues × 37) | 518     | 17      | 501     |
| Status                    | 58      | 30      | 28      |
| Link / highlight          | 4       | 1       | 3       |
| static                    | 117     | 23      | 94      |
| neutral                   | 36      | 22      | 14      |
| primary                   | 16      | 7       | 9       |
| legacy                    | 33      | 2       | 31      |
| shadow                    | 3       | 3       | 0       |
| **Total**                 | **785** | **105** | **680** |

## Target token set

Numbers in parentheses are the count of lobe-ui component directories using the token. "Proposed merge" entries are decided on the canvas (Phase 1), not here.

| Board       | Survivors                                                                                                                                                                                                                                                          | Proposed merges / notes                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Surface     | `colorBgContainer`(36) `colorBgElevated`(15) `colorBgLayout`(21) `colorBgMask`(2) `controlItemBgActive`(1)                                                                                                                                                         | `controlItemBgActive` → a Fill tier                              |
| Text        | `colorText`(54) `colorTextSecondary`(38) `colorTextTertiary`(27) `colorTextQuaternary`(16) `colorTextDescription`(27) `colorTextDisabled`(8) `colorTextPlaceholder`(4) `colorTextHeading`(2) `colorTextLabel`(1) `colorIcon`(2) `colorWhite`(3) `colorTextBase`(1) | `colorTextBase` → `colorText`                                    |
| Border      | `colorBorder`(29) `colorBorderSecondary`(46) `colorSplit`(4)                                                                                                                                                                                                       | —                                                                |
| Fill        | `colorFill`(17) `colorFillSecondary`(31) `colorFillTertiary`(37) `colorFillQuaternary`(18) `colorFillContent`(1)                                                                                                                                                   | `colorFillContent` → `colorFillSecondary`                        |
| Shadow      | `boxShadow`(3) `boxShadowSecondary`(7) `boxShadowTertiary`(4) `colorShadow`(1)                                                                                                                                                                                     | Rebuild Drawer's cast shadow on `boxShadow*`, drop `colorShadow` |
| Primary     | `colorPrimary`(28) `colorPrimaryHover`(6) `colorPrimaryActive`(5) `colorPrimaryBorder`(3) `colorPrimaryBorderHover`(1) `colorPrimaryBg`(2) `primary`(1)                                                                                                            | `primary` → `colorPrimary`                                       |
| Status      | matrix below (36)                                                                                                                                                                                                                                                  | —                                                                |
| Hue accents | `blue` `cyan` `geekblue` `gold` `green` `lime` `magenta` `orange` `purple` `red` `volcano` `yellow` + `geekblue10` `purple10` `volcano10` `purpleFillTertiary`                                                                                                     | One-off steps → bare hue or JS `colorScales`                     |
| Link        | `colorLink`(1)                                                                                                                                                                                                                                                     | Fold into Primary or Status/info                                 |
| Radius      | `borderRadius`(33) `borderRadiusLG`(20) `borderRadiusSM`(17) `borderRadiusXS`(2)                                                                                                                                                                                   | —                                                                |
| Typography  | `fontFamily`(4) `fontFamilyCode`(13) `fontSize`(6) `fontSizeSM`(8) `fontSizeLG`(1) `fontSizeHeading2`–`5` `lineHeightHeading3`(2) `fontWeightStrong`(1)                                                                                                            | Heading ladder single-use; keep as one coherent ladder or inline |
| Motion      | `motionEaseOut`(29) `motionEaseInOut`(7) `motionDurationMid`(2) `motionDurationSlow`(2) `motionEaseInOutCirc`(1)                                                                                                                                                   | —                                                                |
| Spacing     | `paddingXS`(2) `paddingXXS`(1)                                                                                                                                                                                                                                     | Inline as literals, no Spacing board                             |

No `zIndex*` token is used by any component; none survive.

### Aliases found on the canvas

Seven used tokens equal another survivor in both themes and carry an **alias** chip on the canvas: `colorTextDescription` and `colorIcon` = `colorTextTertiary`; `colorTextDisabled` and `colorTextPlaceholder` = `colorTextQuaternary`; `colorTextHeading` = `colorText`; `colorTextLabel` = `colorTextSecondary`; `fontSizeHeading5` = `fontSizeLG`. Whether they collapse into the ladder or stay as role names is decided on the canvas, like the merges.

### Status matrix

Roles: `base`, `Hover`, `Active`, `Bg`, `BgHover`, `Border`, `BorderHover`, `Text`, `FillTertiary` × `Error`, `Warning`, `Info`, `Success` = 36 tokens. Six exist only to complete the matrix (no current use): `colorInfoActive`, `colorSuccessBgHover`, `colorSuccessActive`, `colorWarningHover`, `colorWarningActive`, `colorWarningText`. They carry an **added** chip on the canvas.

## Phase 1: canvas

A generator script (kept under `scripts/token-catalog/`) reads `createLobeTokenGroups` for both appearances plus the usage scan and emits the Design artifact's artboards. No value is hand-typed.

Each board has three bands:

1. **Token grid.** One card per survivor: camelCase and `--lobe-*` names; a split swatch (light half / dark half) drawn on its real parent surface (shadows on `colorBgLayout`, text on `colorBgContainer`); raw values per theme; "Used by" top five component names plus a count; a chip — `keep`, `merge → X`, or `added`.
2. **Scenario strip.** Two or three specimens rebuilt in plain HTML from the exact token values, rendered in light and dark, with callouts naming each token. Specimens are approximations (the canvas cannot load `@lobehub/ui` with its StyleX CSS) and each links to its live docs demo. Initial specimens:
   - Surface: layout → container → elevated popover stack
   - Text / Border / Fill: a list row with title, description, divider, hover fill
   - Shadow: Drawer edge, Popover, Card
   - Primary / Status: Button, Alert, Tag, Input error state
   - Typography: Markdown heading ladder
   - Radius / Motion: control sizes; easing curves plotted
3. **Drop strip.** Unused tokens of that role, compact: name + value, no swatch art. The Hue board collapses its 501 drops into one ramp row per hue.

The reviewed canvas, with any chip overrides, is the decision list Phase 2 implements.

## Docs page: Design Tokens

The reviewed catalog is published as a standalone docs page, `docs/design-tokens.mdx` (route `/design-tokens`, listed in `docs.config.ts` `publicDocs`). Unlike the canvas, it renders with the real `@lobehub/ui` CSS, so it cannot drift from the shipped values.

- **Layout:** one `h2` per board, in reading order: Surface, Text, Border, Fill, Shadow, Primary and link, Status, Hue accents, Radius, Typography, Motion. Each section is a three-column table: token (camelCase, `--lobe-*` name, role, alias target), then a light cell and a dark cell. Every cell is its own `ThemeScope`, so both themes show side by side whatever the site theme is, and the cells follow the site's primary and neutral colors.
- **Values** come from `useTheme()` inside each scope; swatches paint `var(--lobe-*)`. Text rows add WCAG contrast on `colorBgContainer`.
- **Scenes** use real components instead of HTML specimens: a layout → container → elevated stack for Surface, `Alert` and `Tag` for Status, and a play button that runs every easing and spring over the same duration for Motion.
- **Status** is shown as the 9 × 4 role matrix per theme.
- Only surviving tokens are listed; drops are not documented. Source: `docs/design-tokens/` (`tokens.ts` holds the groups and role copy).

## Phase 2: code (PR into `v6`)

1. **Role-split token files.** `src/styles/theme/token/` becomes one file per board (`surface.ts`, `text.ts`, `border.ts`, `fill.ts`, `shadow.ts`, `primary.ts`, `status.ts`, `hue.ts`, `radius.ts`, `typography.ts`, `motion.ts`). `legacy.ts` and the antd bulk of `static.ts` are deleted. `createLobeTokenGroups` composes the role files; `customPrimary` / neutral variants emit only surviving keys.
2. **Generated surfaces follow.** `theme.css`, `cssVar.stylex.ts` (`scripts/buildStylexVars.ts`), the emotion `cssVar` (`src/styles/css.ts`), `useTheme()` and the `LobeToken` type all derive from the token groups; regenerate, no hand edits.
3. **Merges** are rewritten in lobe-ui call sites directly.
4. **Drops for downstream**, via a new `@lobehub/ui-codemod` rule:
   - size, spacing, screen, line-height and z-index tokens are antd constants → inline the literal (`cssVar.paddingSM` → `'12px'`)
   - color tokens → nearest survivor, or the `@lobehub/ui/color` `colorScales` entry
   - anything without a safe mapping → left in place with a codemod report line
5. **Migration doc.** `docs/migration-v6.mdx` gains a token table: old name, replacement or literal, lobe-chat and lobehub-cloud hit counts. Counts set codemod priority only; they do not reverse rule 3.

## Guard

A vitest test reruns the usage scan against the live token set and fails when a token has no lobe-ui component use and is not on an allowlist. The allowlist holds exactly the six status-matrix fillers. Adding a token therefore requires adding a consumer.

## Out of scope

- JS `colorScales` and hue ramps in `@lobehub/ui/color` stay as they are.
- `src/color/CssVar` viewer: follow-up to render from the role boards.
- Value changes. Neutral text, status palette and spring curves are retuned in [2026-10-15-token-value-retune-design.md](./2026-10-15-token-value-retune-design.md); everything else keeps today's values (after the 2026-10-14 shadow fix).

## Risks

- **Downstream breakage is large by design.** lobe-chat / lobehub-cloud consume many antd-shaped tokens (`paddingSM`, `marginXS`…). Mitigation: literal-inlining codemod covers the constant majority; the migration table lists the rest.
- **Scan blind spots.** A token referenced by computed key outside `src/color/CssVar` would be miscounted. The scan found none; the guard test uses the same matcher, so a new dynamic access shows up as a false orphan rather than a silent drop.
- **Specimen drift.** HTML specimens can diverge from real components. Mitigation: every specimen links to its live demo and is regenerated from token values, never restyled by hand.
