# Status palette method (v6, shipped 2026-10-15, PR #723)

Source of truth: `scripts/generateColorTokens.ts`, `docs/superpowers/specs/2026-10-15-token-value-retune-design.md`. If this file and the script disagree, the script wins.

## Rejected approaches, in order

Each was shown to the owner and rejected. Don't repeat them.

| #   | Attempt                                                              | Result                                                               | Owner feedback                                                                                     |
| --- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Pick darker steps 10–11 from the existing hue scales for status Text | warning `#6a4900` muddy brown, error brick red, dark error pale pink | "no longer neutral"                                                                                |
| 2   | OKLCH: one hue per status, equal L and C for all four                | light near-gray, dark pinkish                                        | "too close to grayscale… dark is pinkish"                                                          |
| 3   | Radix tomato/amber/blue/grass steps as-is                            | right direction, but foreign to lobe                                 | asked for HCT with Radix as a fallback                                                             |
| 4   | Pure HCT: one tone/chroma ladder for all steps                       | consistent levels, but too dull                                      | "saturation could be a bit higher, too generic"                                                    |
| 5   | Pure HCT, vivid (+12–16 chroma on solid steps)                       | warning/orange muddy at shared tone 60                               | "pull the main color back a little": the "too dark / brownish" problem                             |
| 6   | **Hybrid**: HCT ladder for structure, old seed for character         | accepted after two rounds of tuner feedback                          | light fills too faint → T98/96; light Text too dark → pulled to seed; yellow still dark → override |

Boss's input (antd-color-editor author): a pure HCT ladder doesn't make every swatch good, so combine it with the old palette.

## Where the old palette came from

[antd-color-editor](https://github.com/ant-design/antd-color-editor): a hand-picked HCT seed at step 9, 9 eased steps up to T100, 3 down to T1, and a sine-compensated hue rotation per hue. Every swatch looks good because it grows from a hand-tuned seed. Levels are uneven because the targets are absolute tones while seed tones differ: warning seed T71, info T50, so light Border lands at T95 for warning and T87–89 for the rest.

## Ladders (steps 1–11; step 0 and step 12 sit outside the role range)

|              | 1   | 2   | 3    | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  |
| ------------ | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
| light tone   | 98  | 96  | 93.5 | 91  | 87  | 82  | 75  | 67  | 60  | 48  | 36  |
| light chroma | 6   | 10  | 15   | 20  | 28  | 38  | 52  | 66  | 76  | 72  | 62  |
| dark tone    | 9   | 16  | 23   | 34  | 42  | 48  | 54  | 60  | 66  | 82  | 92  |
| dark chroma  | 30  | 36  | 42   | 48  | 56  | 64  | 70  | 74  | 72  | 44  | 20  |

Adjustments on top, in this order:

1. **Base tone shift**: light base tone 61 (+1), with weights 0.5/1/1/1/0.5 on steps 7–11.
2. **Main pull = 1**: step 9 moves to the seed's tone. Taper: light steps 5–9 at 0.1/0.25/0.5/0.75/1; dark steps 6–10 at 0.5/1/1/1/0.5. Dark is capped at T74.
3. **Warning lift +7** on the same taper. A sudden lift at one step makes it brighter than its neighbor, which breaks monotonicity.
4. **Light Text** (step 10) at least 8 tone below main.
5. **Light warning Text override**: T65, H74, C80 → `#d78f00`. `#966e00` and `#c08400` were rejected as too dark.

Hue: master hue per theme (light error 31, warning 80, info 262, success 149; dark 22 / 80 / 252 / 132). Light offsets = old palette's per-step offsets from its seed; Radix offsets turned warning tints khaki and info tints gray-cyan in light. Dark offsets = Radix per-tone curves, stored as `[tone, offset]` points and interpolated. The baked curves drop extreme outlier points such as tomatoDark step 1 (T5.7, −13.9°); review measure-radix output the same way.

Gamut guard: `Hct.from(h, c, t)` silently changes hue when it can't hold the chroma. At T99, warm hues flip to purple (the old `#fffdff` warning Bg). The fix is to lower chroma 0.5 at a time until the hue is within 8° of the target. This is also why step 1 is T98 and not T99.

## Role mapping (`generateColorPalette` + `createPaletteToken`)

| Role                  | Light step           | Dark step       |
| --------------------- | -------------------- | --------------- |
| Bg / BgHover          | 1 / 2                | 1 / 2           |
| Border / BorderHover  | 4 / 3                | 4 / 5           |
| Hover / base / Active | 8 / 9 / 10           | 10 / 9 / 7      |
| Text                  | 10 (status override) | 9               |
| Fill…                 | `lightA` 4/3/2/1     | `darkA` 3/2/1/0 |

`lightA` / `darkA` = the most transparent rgba that renders the step over `#ffffff` / `#000000`. `colorLink` follows `colorInfoText`. Primary uses the same `generateColorPalette` but no Text override.

## Neutral text

Don't write new text values into gray scale steps. The scale would stop being monotonic, and it's public as `colorScales.gray`. Generate `neutralText.ts` at fixed HCT tones per neutral, using the neutral's own step-9 hue/chroma:

| Role                | Light tone | Dark tone |
| ------------------- | ---------- | --------- |
| colorText           | 11.8       | 91.3      |
| colorTextSecondary  | 43.2       | 73.3      |
| colorTextTertiary   | 57.5       | 59.4      |
| colorTextQuaternary | 71.8       | 45.2      |

A pure gray seed must get chroma 0. HCT reports about 2 for `#999999`, which tints the gray blue. Borders and surfaces stayed unchanged because too much business UI depends on them.

## Contrast audit

Measure each foreground on its real surface: `colorBgContainer` is `#ffffff` light and `#0d0d0d` dark. Composite rgba over the surface first. Report WCAG 2 ratio and APCA Lc; APCA is the better read in dark mode, where glare shows up (old dark `colorText` `#fff` was Lc 108, the ceiling).

## Live tuner board

1. Bundle HCT: an entry file that re-exports `Hct`, `argbFromHex`, `hexFromArgb`, built with `tsdown` as IIFE with a global name (the 2026-10-14 bundle was 21 KB). Upload it as an artifact asset, since boards can't fetch packages.
2. Inline the ladders, offsets and Radix curves as data, and run the same algorithm in the browser as in the script.
3. Show summary cards (contrast spread per theme, achieved base chroma, error hue range as a pink check), a base/Text table with hex + H/C/T + contrast, Alert/Tag/Button panels (light/dark × now/tuned), and scale rows (old / tuned / pure HCT).
4. A settings box prints the current parameters for the reviewer to paste back. Tweaks edits are saved into the board's defaults, so re-read the artifact before republishing and merge their values.

Reference board from the original run: "Lobe Design Tokens" canvas, boards "Status palette tuner" and "Status palette hybrid".
