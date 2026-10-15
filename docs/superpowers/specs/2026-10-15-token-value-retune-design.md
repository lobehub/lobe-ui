# Token value retune: neutral text, status palette, spring curves

Date: 2026-10-15 · Branch: `v6` · Status: approved on the canvas, implemented

Companion to [2026-10-15-design-token-catalog-design.md](./2026-10-15-design-token-catalog-design.md). The catalog spec decides **which** tokens exist; this one changes the **values** of some survivors and adds three motion tokens. The two can ship independently.

Canvas (review artifact): https://claude.ai/artifact/Ug4bvyD9gsmgaUgyNujKHK — boards "Contrast retune", "Status palette tuner", "Status palette hybrid", "Motion".

## Goal

1. Dark-mode text is pinned to `#ffffff` (19.4:1 on `colorBgContainer`, APCA Lc 108, the ceiling) and glares; tertiary and quaternary ink are below a readable floor in both themes. Bring the neutral text ladder into a band.
2. Status colors are uneven: each status uses a different scale per theme (error is volcano in light, pink-red `red` in dark; success is green in light, fluorescent `lime` in dark), and the four sit at different visual levels. Give all four statuses one shared tone/chroma structure per theme, so Bg, Border, base and Text read at the same level in light and dark.
3. Springs are hand-baked into `linear()` per component (Tooltip, Toast). Provide them as tokens.

## Decisions

| #   | Decision                                                      | Choice                                                                                                                           |
| --- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Borders (`colorBorder`, `colorBorderSecondary`, `colorSplit`) | Unchanged: too much business UI depends on them                                                                                  |
| 2   | Neutral text source                                           | Generated at fixed HCT tones per neutral, no longer read from scale steps                                                        |
| 3   | Light `colorTextTertiary`                                     | `#8a8a8a` (3.45:1), keeps four distinct ladder steps                                                                             |
| 4   | Status palette method                                         | HCT tone/chroma ladders, main color pulled back to the old seed tone, hue rotation from the old palette (light) and Radix (dark) |
| 5   | Status anchors                                                | Light Warning Alert and dark Info Alert are the **target** look; the other statuses move toward them                             |
| 6   | Hue scales (`blue`, `red`, … in `@lobehub/ui/color`)          | Unchanged; status gets its own scales                                                                                            |
| 7   | Springs                                                       | Three CSS `linear()` curves, normalized to settle time                                                                           |

## Part 1: neutral text ladder

### Values (gray)

Measured on `colorBgContainer` (`#ffffff` light, `#0d0d0d` dark).

| Token                 | Light now → new                     | Dark now → new                      |
| --------------------- | ----------------------------------- | ----------------------------------- |
| `colorText`           | `#080808` 20.0:1 → `#1f1f1f` 16.5:1 | `#ffffff` 19.4:1 → `#e6e6e6` 15.6:1 |
| `colorTextSecondary`  | `#666666` 5.7:1 → unchanged         | `#aaaaaa` 8.4:1 → `#b4b4b4` 9.4:1   |
| `colorTextTertiary`   | `#999999` 2.85:1 → `#8a8a8a` 3.45:1 | `#6f6f6f` 3.9:1 → `#8f8f8f` 6.0:1   |
| `colorTextQuaternary` | `#bbbbbb` 1.9:1 → `#b0b0b0` 2.2:1   | `#555555` 2.6:1 → `#6b6b6b` 3.7:1   |

The new dark values sit on Radix gray 12 / 11 (`#eeeeee` / `#b4b4b4`); light on `#202020` / `#646464`. Aliases derived from these tokens in `neutral.ts` (`colorTextDescription`, `colorIcon`, `colorTextDisabled`, `colorTextPlaceholder`, `colorTextHeading`, `colorTextLabel`, `colorIconHover`) follow automatically.

Light `colorText` (`#080808` → `#1f1f1f`) is the one optional row: the glare problem is dark-only. It ships unless the review says otherwise.

### Mechanism

`generateColorNeutralPalette` reads `colorText` / `Secondary` / `Tertiary` / `Quaternary` from scale steps 12 / 10 / 8 / 6. The new values cannot be written back into those steps: dark `#6b6b6b` at step 6 would be lighter than step 7 (`#666666`), breaking the scale's monotonic order, and the scale is also public as `colorScales.gray`.

Instead:

1. `scripts/generateColorTokens.ts` writes `src/styles/theme/token/neutralText.ts`: for each of the 6 neutrals, four colors per theme at fixed HCT tones, using the neutral's own hue and chroma from its step 9, so tinted neutrals keep their tint. A pure gray seed gets chroma 0 (HCT reports about 2 for `#999999`).

   | Role                  | Light tone | Dark tone |
   | --------------------- | ---------- | --------- |
   | `colorText`           | 11.8       | 91.3      |
   | `colorTextSecondary`  | 43.2       | 73.3      |
   | `colorTextTertiary`   | 57.5       | 59.4      |
   | `colorTextQuaternary` | 71.8       | 45.2      |

   For gray these tones reproduce the table above exactly.

2. `createNeutralToken` overrides the four text roles from that table. `generateColorNeutralPalette` (public) and the scale arrays are untouched.

## Part 2: status palette on HCT

### Where the old palette came from

Lobe's status scales were generated with [antd-color-editor](https://github.com/ant-design/antd-color-editor): a hand-picked HCT seed at step 9, nine eased steps up to tone 100, three down to tone 1, and a small sine-compensated hue rotation. Each scale looks right on its own, but the role steps land at different tones per status because the seeds sit at different tones (light Border is tone 95 for warning and 87–89 for the rest). Each status also used a different scale per theme: error was `volcano` in light and pink-red `red` in dark, and success was `green` in light and fluorescent `lime` in dark.

### Method

Every status shares one tone/chroma ladder per theme. The ladders come from the review anchors: light Warning Alert and dark Info Alert. The main color is then pulled back to the old seed's tone, so each hue keeps its old weight. The canvas tuner ("Status palette tuner") computes the same thing live; `scripts/generateColorTokens.ts` is the port that ships.

| Step         | 1   | 2   | 3    | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  |
| ------------ | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
| light tone   | 98  | 96  | 93.5 | 91  | 87  | 82  | 75  | 67  | 60  | 48  | 36  |
| light chroma | 6   | 10  | 15   | 20  | 28  | 38  | 52  | 66  | 76  | 72  | 62  |
| dark tone    | 9   | 16  | 23   | 34  | 42  | 48  | 54  | 60  | 66  | 82  | 92  |
| dark chroma  | 30  | 36  | 42   | 48  | 56  | 64  | 70  | 74  | 72  | 44  | 20  |

Adjustments applied on top of the ladder:

1. **Base tone shift**: light +1 (base tone 61). It applies to steps 7–11 with weights 0.5 / 1 / 1 / 1 / 0.5. Dark stays at 66.
2. **Main pull = 1**: step 9 moves to the old seed's tone. Neighbors follow on a taper: light steps 5–9 at 0.1 / 0.25 / 0.5 / 0.75 / 1; dark steps 6–10 at 0.5 / 1 / 1 / 1 / 0.5. Dark is capped at tone 74, so the old fluorescent lime (tone 89) does not come back.
3. **Warning tone lift +7**: same taper as the pull, so the warning ramp stays monotonic. In dark, steps 7–9 get full weight and step 10 gets 0.5.
4. **Light Text** (step 10) sits at least 8 tone below the main color, so it never collapses onto it. This applies to info, whose old seed is tone 50.
5. **Light warning Text exception**: tone 65, hue 74, `#d78f00`. Below tone 65, yellow cannot hold chroma in sRGB and reads brown; the review rejected `#966e00` and `#c08400` as too dark.

### Hue

- Master hue per theme, following the old palette instead of forcing one hue across themes: light error 31, warning 80, info 262, success 149; dark error 22, warning 80, info 252, success 132.
- **Light** rotation uses the old palette's per-step offsets from its seed. Tints stay in today's hue family; Radix offsets turned warning tints khaki and info tints gray-cyan.
- **Dark** rotation uses Radix's measured per-tone offsets (tomato, amber, blue, grass in `@radix-ui/colors` 3.0.0), baked into the script as tone/offset points.
- Gamut guard: when HCT cannot hold the requested chroma, the hue drifts (at tone 99 warm hues flip to purple; today's `#fffdff` warning Bg). The generator lowers chroma in 0.5 steps until the solved hue is within 8° of the target. This is also why step 1 sits at tone 98, not 99.

### Results

Contrast on `colorBgContainer` (`#ffffff` light, `#0d0d0d` dark):

|         | light Bg / Border     | light base (9)   | light Text (10)  | dark Bg / Border      | dark base = Text (9) |
| ------- | --------------------- | ---------------- | ---------------- | --------------------- | -------------------- |
| Error   | `#fef8f7` / `#ffded8` | `#f35837` 3.35:1 | `#ce461e` 4.65:1 | `#340b0c` / `#8a3334` | `#e95350` 5.38:1     |
| Warning | `#fff8f3` / `#ffe1b3` | `#feb400` 1.79:1 | `#d78f00` 2.69:1 | `#251700` / `#724600` | `#ffbe45` 11.76:1    |
| Info    | `#f8f9ff` / `#d7e6ff` | `#0076e3` 4.47:1 | `#0060cc` 5.92:1 | `#001a35` / `#005389` | `#4cb3ff` 8.51:1     |
| Success | `#f8fbf1` / `#d4eccc` | `#00a03f` 3.44:1 | `#00864e` 4.65:1 | `#061f00` / `#315a09` | `#80c933` 9.55:1     |

Light warning is the one status below 3:1, by choice: the review preferred today's bright amber over a uniform contrast band (today's warning text, which uses the base, is 2.2:1). Dark error moves from pink-red (`#f4416c`, hue 10) to red (hue 22); dark success from lime (`#c4f042`, 14.7:1) to green.

### Role mapping

`generateColorPalette` is unchanged, because primary also uses it. `createPaletteToken` overrides one role for the status palettes:

| Role                  | Light step     | Dark step  |
| --------------------- | -------------- | ---------- |
| Bg / BgHover          | 1 / 2          | 1 / 2      |
| Border / BorderHover  | 4 / 3          | 4 / 5      |
| Hover / base / Active | 8 / 9 / 10     | 10 / 9 / 7 |
| **Text**              | **10** (was 9) | 9          |

This gives the Status `Text` row real values in light mode (it was an exact alias of base), so the catalog spec's 9 × 4 status matrix keeps all rows. `colorLink` follows `colorInfoText`, so light links get darker (`#0060cc`).

### Mechanism

1. `scripts/generateColorTokens.ts` (`tsx scripts/generateColorTokens.ts`) writes `src/color/status/{error,warning,info,success}.ts` as static `ColorScaleItem`s: 13 steps, plus `lightA` / `darkA` solved as the most transparent rgba over `#ffffff` / `#000000`. Steps 0 and 12 sit outside the role range: `#ffffff` and tone 24 in light; tone 4 and tone 98 in dark. Generated files are committed; there is no runtime dependency.
2. `@material/material-color-utilities` 0.4.0 becomes a devDependency. Its index has extensionless imports that Node cannot resolve: `tsx` can, and Vitest inlines the package.
3. `src/styles/theme/token/palette.ts` drops the `statusScales` light/dark split and reads `statusColorScales` from `src/color/status` for both appearances. The hue scales in `@lobehub/ui/color` are untouched.
4. `colorErrorOutline` / `colorWarningOutline` and every other status-derived token follow automatically.

## Part 3: spring curves

Three tokens in `src/styles/theme/token/static.ts`, each a 32-sample `linear()` of a damped spring normalized to its settle time. The shape depends only on the damping ratio ζ, so each curve pairs with any duration, which then becomes the spring's settle time.

| Token                | ζ   | Overshoot | Settle threshold | Used by                                                     |
| -------------------- | --- | --------- | ---------------- | ----------------------------------------------------------- |
| `motionSpringSmooth` | 1.0 | 0%        | 0.1%             | No CSS consumer yet: the critically damped option           |
| `motionSpringSnappy` | 0.8 | 1.5%      | 0.1%             | Toast dodge, FloatingPanel dodge (were ζ 0.81, 608ms)       |
| `motionSpringBouncy` | 0.7 | 4.6%      | 0.3%             | Tooltip enter and glide, Popover glide (were ζ 0.72, 280ms) |

Bouncy uses a looser threshold because the old Tooltip curve was cut at 280ms before fully settling. At 0.3% the token matches it to within 0.010; snappy matches the old Toast curve to within 0.016. Components keep their durations. `TOAST_DODGE_EASE` and the `ease` const in `dodge.stylex.ts` go away (no consumers). Button, Switch and Image configure `motion` (JS) springs and stay on JS. Reduced motion is unchanged: components already zero their durations.

## Testing

- `createLobeToken` snapshot updated; diff reviewed against the tables above.
- `src/color/status/status.test.ts`: the committed status scales and `neutralText.ts` equal the generator's output; tones are strictly monotonic over steps 1–11 in both themes; no error step with chroma ≥ 3 has hue below 15° (no pink drift).
- `cssVar.stylex.ts` regenerated (`pnpm build:stylex-vars`); its existing test checks the three spring variables exist in `theme.css`.
- Visual check of Alert, Tag, Toast, Tooltip, Markdown and Highlighter demos in both themes via the `local-testing` skill.

## Out of scope

- Border, surface and fill values.
- Primary color and the hue accent scales (`blue`, `red`, …) used by ColorSwatches and Highlighter.
- Moving `motion`-library springs to CSS.

## Risks

- **Every status color changes in dark mode**, most visibly error and success. Downstream screens with status-colored chrome will look different. Mitigation: values stay in today's hue families; the canvas tuner shows now vs tuned for review, and the docs Design Tokens page shows the live values.
- **Light Text moves to step 10**, so status copy gets darker. Components that intentionally drew status text at base color (dots, icons) should read `colorX`, not `colorXText`. Audit the 30 status-token call sites in the catalog usage scan.
- **Neutral text shifts in every neutral theme** (mauve, olive, sage, sand, slate), not only gray. The tone-based generation keeps their tints, but each needs a visual pass.
