---
name: tuning-color-palettes
description: >
  Use when retuning or customizing lobe-ui color tokens: an enterprise / white-label palette, a
  custom brand primary, status colors (error / warning / info / success) that feel off, dark-mode
  text glare, colors drifting pink / gray / muddy / brown, uneven Alert or Tag levels between light
  and dark, or edits to scripts/generateColorTokens.ts and src/color/status. Trigger on 定制色板,
  企业版色板, 品牌色, 调色, 色阶, 状态色, 发粉, 发灰, 发黑, 对比度, HCT, Radix colors.
---

# Tuning color palettes

lobe-ui's status colors are **generated** by `scripts/generateColorTokens.ts`: every theme shares one HCT tone/chroma ladder, which keeps levels consistent; the tone of step 9 is pulled back to the seed color's tone, which keeps each hue's weight; hue-rotation data keeps the look. Hue comes from the master hue and chroma from the ladder, so the seed hex itself does **not** appear verbatim (`#ec5e41` generates as `#f35837`). When a brand hex must be hit exactly, pin step 9 explicitly.

Customizing a palette means regenerating with new inputs and handing the result to human review, never hand-editing hex values. All numbers, role mappings and rejected approaches are in `references/method.md`; read its "Rejected approaches" section before you start.

## Workflow

1. **Measure the current state.** Run `pnpm exec tsx .agents/skills/tuning-color-palettes/scripts/audit-palette.ts`. Optional flags: `--primary '#hex'`, `--neutral sand`, `--scales file.json` (`{ error?, warning?, info?, success?, primary? }`, values are `ColorScaleItem`, i.e. the named palette to register), `--json`. It prints hex, H/C/T, WCAG ratio and APCA Lc per role, one set for light and one for dark. Run it once before and once after the change.
2. **Ask the requester all of the following at once; don't decide on your own:**
   - Anchor: which existing component, in which theme, "looks right". lobe's own anchors are the light Warning Alert and the dark Info Alert.
   - The seed hex for each status, or an acceptable hue direction; whether the brand color must be hit exactly.
   - The delivery form, see "Delivery".
   - Whether neutrals, borders and surfaces stay unchanged. Default: unchanged.
3. **Prepare inputs for every new hue; don't reuse old data:**
   - `MASTER_HUE`: light and dark may differ; they don't have to share a hue.
   - `ORIGINAL_BASE`: replace it with the customer's seed. The main pull moves toward this tone; if you don't replace it, it pulls toward the tone of lobe's old color.
   - Hue rotation: `LIGHT_HUE_OFFSET` was measured step by step from lobe's old palette, and `DARK_HUE_CURVE` from Radix tomato/amber/blue/grass; both are only valid for the original hues. Re-measure when the hue moves by more than about 15°:
     1. Pick the closest Radix scale.
     2. Run `npm pack @radix-ui/colors@3.0.0` and unpack it into a scratchpad.
     3. Run `pnpm exec tsx .agents/skills/tuning-color-palettes/scripts/measure-radix.ts <dir>/package crimson orange teal`.
     4. For light, take the `offsets` (per-step array) from the `<scale>` row and halve the magnitude, because Radix's light curve pushes tints toward khaki or gray-cyan. For dark, take the `curve` from the `<scale>Dark` row and drop the outliers at both ends.
4. **Generate and audit.** The generator is parameterized as presets; the default preset's output must be byte-identical to the files in the repo (`src/color/status/status.test.ts` checks this). Output new scales as JSON, audit them with `--scales`, then check every hard criterion below.
5. **Build an adjustable review board and let human eyes decide.** Bundle the HCT library into an IIFE with tsdown and put it on the board. Sliders cover light/dark master hue, tint chroma, solid chroma, base tone, main pull, hue-rotation strength and warning lift. Each panel shows now vs. tuned Alert / Tag / Button side by side, one set for light and one for dark. The board prints the current parameters at the bottom; the requester copies them to you and you write them back into the preset. Details in method.md, "Live tuner board".
6. **Land and verify.** Regenerate, update snapshots, and add invariant tests to the preset covering every row of the criteria table that can be automated. Use the `local-testing` skill to check Alert, Tag, Toast, Tooltip, Markdown links, Button and `/design-tokens` in both light and dark themes.

## Hard criteria

| Check             | Rule                                                                                                                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monotonic         | Tones of steps 1–11 are strictly monotonic: decreasing in light, increasing in dark. Apply warning lift with graded weights, never as a jump on a single step                                                                                               |
| Consistent levels | Within one theme, Bg / BgHover / Border / BorderHover have the same contrast across scales (±0.02:1). Base is pulled back to each seed's tone, so it differs on purpose                                                                                     |
| Light Text        | ≥ 4.5:1 and ≥ 8 tone darker than main. Exception: yellow turns brown below tone 65, so accept lower contrast instead                                                                                                                                        |
| Dark body text    | `colorText` must not be `#fff`. lobe uses `#e6e6e6` at tone 91                                                                                                                                                                                              |
| No pink drift     | For error steps with chroma ≥ 3, hue ≥ 15°. The dark master hue floor is 15 + the dark curve's largest negative offset (6.5 for tomato, so ≥ 21.5). If the customer wants crimson, write the lowered floor into the preset and tests and tell the requester |
| Gamut             | Warm colors flip to purple at tone 98/99. The gamut guard lowers chroma by 0.5 at a time until the hue deviation is ≤ 8°                                                                                                                                    |
| Dark glare        | Dark base tone is capped at 74. High chroma plus high tone glares (the old lime is an example)                                                                                                                                                              |
| Brand collision   | A custom primary must be ≥ 20° in hue from success and info. Note that lobe's `cyan` is actually mint green (about 170°)                                                                                                                                    |

## Aesthetic criteria (the requester's own words)

- "Too close to grayscale / too generic": chroma is too low. Solid steps may be more vivid than the old palette; keep tints (steps 1–4) soft.
- "Grayish": the light range has no hue rotation, or tint chroma is too low. Light steps 1–5 are about C 6/10/15/20/28.
- "Too dark / brownish": yellow-orange was pushed below its natural tone. Solid steps must stay at the hue's own tone, not be lowered for uniformity. The T65 Text override and the +7 lift were tuned for amber; for other warm colors such as orange, start the lift at 0 and sweep tone on the review board for the requester to choose.
- "Pinkish": the dark red's hue falls into 4–10°, or chroma is too high.
- "Fills too pale": light Bg / BgHover are too close to white. lobe uses T98/96.
- Not enough gamut (e.g. teal tops out around C45 at T50, today's blue has C63): put both versions on the review board, "accept lower chroma" and "move the hue toward one that holds chroma".
- A pure HCT ladder keeps levels steady but doesn't guarantee every swatch looks good. That is why tone is pulled back to the seed and hue is rotated per hue.

## Primary (brand color)

First check the result with `setLobeTheme({ primaryColor: '#hex' })` plus `audit-palette.ts --primary '#hex'`. Rules of `generatePrimaryScale`:

- The reference preset is chosen by hue and lightness together. Choosing by hue alone makes a dark green pick the very light `cyan` mint.
- Light step 9 is the chosen hex; neighboring steps follow with graded weights and the scale stays monotonic.
- In dark, if it is below 4.5:1 on dark containers, keep hue and chroma and raise lightness to 4.5:1. For example, `#1a7f5a` becomes `#298a64` in dark. If the requester insists on the exact hex in dark too, tell them explicitly that it costs readability.

If the runtime result is not good enough (tints too weak, or per-hue rotation needed), you can generate a static scale with the status-color method, but `registerLobePalette` does not accept primary. In that case the only option is override CSS: `--lobe-color-primary*` variables, with the same selectors as `themeCss.ts`, loaded after `theme.css`, and without setting `data-primary-color`. `colorPrimary` from `useTheme()` is still the runtime-generated value; tell the requester when delivering.

## Delivery

| Form                    | How                                                                                                                                                                                                                                                                                                                                                                           | Note                                                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Named palette (default) | The generator outputs `ColorScaleItem`s for the four statuses; the customer calls `registerLobePalette('acme', { error, warning, info, success })` at module top level, then enables it with `setLobeTheme({ palette: 'acme' })`, `<ThemeScope palette>` or `<LobeThemeScript palette>`. CSS and `useTheme()` read the same registry; for SSR use `getCustomPaletteCss(name)` | Names may only contain letters, digits, `_` and `-`. After re-registering the same name, call `setLobeTheme` again so the root stylesheet is rewritten |
| Primary                 | `primaryColor: '#hex'`, checked per the "Primary" section                                                                                                                                                                                                                                                                                                                     | No override CSS needed                                                                                                                                 |
| In-repo preset          | The generator reads the preset and outputs scale files; default files stay unchanged                                                                                                                                                                                                                                                                                          | The customer's name lands in a public repo; confirm that is allowed first                                                                              |

## Common mistakes

| Mistake                                                                  | Do this instead                                                                                                  |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Picking steps 10–11 of an existing scale as the new values               | Hue/chroma drift inside a scale: warning turns brown, dark error turns pink. Use the generator                   |
| Forcing the four statuses to the same L/C in OKLCH                       | Light turns gray and dark turns pink. Levels come from HCT tone; character comes from seed tone and hue rotation |
| Writing Radix values from memory                                         | Take them from the registry tarball and measure with measure-radix                                               |
| Reusing old offsets or the old `ORIGINAL_BASE` for a new hue             | Re-measure rotation data for every new hue and replace it with the customer's seed                               |
| Assuming the generator keeps the seed hex                                | It keeps only the seed's tone. Pin step 9 to hit it exactly                                                      |
| Also changing borders, surfaces or the gray scale                        | Too much blast radius. Leave them unless the requester names them                                                |
| Hand-editing generated `src/color/status/*.ts`                           | Change the parameters and regenerate. `status.test.ts` catches inconsistent files                                |
| `@material/material-color-utilities` 0.4.0 fails to import in plain Node | Its index has extensionless imports. Run with `tsx`, or import `hct/hct.js` and `utils/string_utils.js` directly |
