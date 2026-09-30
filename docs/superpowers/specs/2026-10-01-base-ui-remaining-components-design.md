# base-ui remaining components: DatePicker, ColorPicker, QRCode, Burger, Input gaps

Date: 2026-10-01
Design canvas: https://claude.ai/artifact/MWpkxhiCyC8FQD9r13L59K (page "New components")

## Goal

Every antd-backed root component in `@lobehub/ui` gets a base-ui counterpart, so lobe-ui and its downstream apps can drop `antd`, `@ant-design/*`, `@rc-component/*` and `rc-*` entirely.

Rules agreed with the owner:

- Build every counterpart, including components with zero downstream uses today (ColorPicker, Burger).
- Design each API for developer experience. Do not copy antd props that nothing uses; do not keep antd value types (dayjs, `Color`) in public signatures.
- No new dependency on `antd`, `@ant-design/*`, `@rc-component/*` or `rc-*`. `antd-style` is the one exception and stays.

Out of scope here (separate specs):

- Form state layer (`useForm`, `useWatch`, `rules`, `Form.List`).
- Rewiring root components that use antd internally (Collapse, Dropdown, Menu, EditableText, EmojiPicker, GuideCard, Highlighter, HotkeyInput, ImageSelect, Img, SliderWithInput, ThemeSwitch, Toc, mobile/ChatInputArea, Markdown, ThemeProvider).
- Downstream migration and eslint bans.

## Downstream usage (oss canary + cloud main, 2026-10-01)

| Component    | Uses       | Shape                                                                                                                                                                                   |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DatePicker   | 5          | 3× RangePicker (`allowClear`, `disabledDate`, `format`, placeholder pair); 1× `picker="month"`; 1× single date with `minDate`, `showNow={false}`, `renderExtraFooter` ("Never expires") |
| QRCode       | 4          | `value`, `size`, `bordered={false}`, all pass `color="#000" bgColor="#fff"`                                                                                                             |
| ColorPicker  | 0          | only inside lobe-ui `ColorSwatches` (custom colour slot)                                                                                                                                |
| Burger       | 0          | root lobe-ui component, antd `Drawer` + `Menu`                                                                                                                                          |
| Input family | ~204 files | missing `onPressEnter` (43), `allowClear`, InputNumber `precision` / `formatter`                                                                                                        |

## Visual language (owner decision, 2026-10-01)

Style B on a solid surface:

- Popovers: solid `colorBgElevated`, 16px radius, `boxShadow` (the large layered one) plus `--lobe-ring`. No backdrop blur.
- Type: 22px / 600 titles with the secondary part (year, unit) in `colorTextTertiary` at weight 400; small uppercase letter-spaced labels (10px / 600 / 0.08em).
- Shape: round day cells, pill buttons, round slider thumbs with a 3px white border.
- Selection: solid `colorText` fill with `colorBgContainer` text. Today / current: 1px inset ring in `colorText`.
- Triggers reuse the base-ui Input shell (variants, sizes, 8px radius) so they align inside forms.

## Components

### DatePicker and DateRangePicker

```tsx
<DatePicker
  value={date}              // Date | null
  onChange={setDate}        // (date: Date | null) => void
  mode="date"               // 'date' | 'month' | 'year'
  min={new Date()}
  max={...}
  disabledDate={(d) => ...} // (date: Date) => boolean
  allowClear
  format="ll"               // dayjs format string, default per mode: 'll' / 'MMMM YYYY' / 'YYYY'
  placeholder="Select date"
  footer={<Button>Never expires</Button>}
  variant size disabled
/>

<DateRangePicker
  value={[start, end]}      // [Date | null, Date | null]
  onChange={setRange}       // ([start, end]) => void
  placeholder={['Start', 'End']}
  min max disabledDate allowClear format variant size disabled
/>
```

- Values are native `Date`. dayjs is an internal dependency (already in `dependencies`) and never appears in public types.
- `DateRangePicker` is a separate component so each has one value type; no `picker` prop that changes the `onChange` signature.
- Clicking the popover title drills date → month → year; `mode` fixes the lowest level.
- The grid always renders 6 rows so the popover height never changes between months.
- Week start and month / weekday names follow the active dayjs locale.
- `footer` is a ReactNode slot rendered under the grid, separated by a 1px divider.
- Range: two months side by side; the band between start and end is a `colorFillSecondary` strip joining the two filled circles. After picking the start, hovering previews the band; the trigger underlines the half being edited.
- Keyboard: arrow keys move by day, PageUp / PageDown by month, Home / End to week start / end, Enter selects, Esc closes and returns focus to the trigger. The grid is a `role="grid"` with `aria-selected` / `aria-disabled` on cells.
- Built on base-ui `Popover`.
- Not built (0 uses): time picking, week, quarter, presets. Add when a caller needs them.

Downstream mapping:

| antd                       | new                                                              |
| -------------------------- | ---------------------------------------------------------------- |
| `DatePicker` value `Dayjs` | `DatePicker` value `Date` (`dayjs(x).toDate()` at the call site) |
| `picker="month"`           | `mode="month"`                                                   |
| `minDate`                  | `min`                                                            |
| `renderExtraFooter`        | `footer`                                                         |
| `showNow={false}`          | default (no "Today" button)                                      |
| `DatePicker.RangePicker`   | `DateRangePicker`                                                |

### ColorPicker

```tsx
<ColorPicker
  value="#0072f5"              // hex string; '#rrggbbaa' when alpha is on
  onChange={setColor}          // fires while dragging
  onChangeComplete={save}      // fires on pointer release / input commit
  alpha                        // show the alpha slider, emit 8-digit hex
  presets={['#f4416c', ...]}   // swatch row
  showText                     // trigger shows swatch + hex in the Input shell
  size disabled
>
  {/* optional custom trigger */}
</ColorPicker>
```

- Value is a hex string. No `Color` class to unwrap.
- Popover: 40px round swatch + hex value as the headline, saturation / value square (12px radius), hue slider, optional alpha slider, hex input in the filled Input variant, optional presets row with a ring on the selected swatch.
- EyeDropper button renders only where `window.EyeDropper` exists.
- Colour math with `chroma-js` (already a dependency). Sliders on base-ui `Slider`; the saturation square is a custom 2D pointer area exposed as one `role="slider"` whose `aria-valuetext` reads saturation and brightness; arrow keys move 1%, Shift+arrow 10%.
- `ColorSwatches` switches its custom slot from antd `ColorPicker` to this component.
- Input format: HEX only. Add RGB / HSL toggles when a caller needs them.

### QRCode

```tsx
<QRCode
  value="https://..."
  size={160}
  icon={<img alt="" src={logo} />} // optional centre logo
  bordered // default true
  status="active" // 'active' | 'loading' | 'expired'
  onRefresh={regenerate} // renders the Refresh button when status="expired"
  errorLevel="M" // 'L' | 'M' | 'Q' | 'H'; forced to 'H' when icon is set
/>
```

- Dark modules on white in both themes by default: every current call site passes `color="#000" bgColor="#fff"` so phones can scan in dark mode. `color` / `bgColor` remain as overrides.
- Output is SVG (one `<path>`), crisp at any size.
- The centre icon clears the modules under it and sits in a circle with a 4px white border.
- Loading and expired overlays cover the code at 95% white; expired shows "Expired" and a pill Refresh button when `onRefresh` is given. Overlay text comes from the i18n locale.
- Encoder: `uqr` (unjs; zero dependencies, TypeScript, ESM, 79 KB unpacked, 0 open issues). Fallback if it becomes unmaintained: `qr` (paulmillr).

Downstream mapping: drop `color` / `bgColor` / `bordered={false}` where they only restate the defaults; `size` and `value` are unchanged.

### Burger

```tsx
<Burger
  items={items}               // base-ui List item shape: { key, icon, label } | { type: 'divider' }
  activeKey={active}
  onSelect={(key) => ...}
  opened={opened}
  onOpenChange={setOpened}
  headerHeight={64}
  fullscreen
  footer={<Button>Sign in</Button>} // fullscreen only
/>
```

- `items` share the base-ui `List` item type, so nav builders work for both.
- `onOpenChange` replaces `setOpened` (base-ui naming).
- Default: base-ui `Drawer` opens under the header; rows are 52px pills with 20px icons and 17px text; the active row is filled `colorText`.
- `fullscreen`: covers the header, brings its own close button, renders labels in 32px / 600 type without icons (inactive in `colorTextQuaternary`, active in `colorText`), with the `footer` slot pinned to the bottom.
- No nested submenus (0 uses).

### Input family gaps

- `onPressEnter(event)` on `Input`, `InputPassword`, `InputNumber`, `TextArea`: not fired while `event.nativeEvent.isComposing` is true (Chinese / Japanese IME), unlike antd.
- `allowClear` + `onClear` on `Input`, `InputPassword`, `TextArea`: a 16px round clear button, shown only when there is a value and the field is hovered or focused, placed before any `suffix`. Clearing emits `onChange` with an empty value and keeps focus.
- `InputNumber`:
  - `format?: Intl.NumberFormatOptions` (passed to base-ui `NumberField`, which parses it back) replaces antd's `formatter` + `parser` pair.
  - `precision?: number` is sugar for `format.minimumFractionDigits` / `maximumFractionDigits`.
  - `prefix` / `suffix` for units.
- `TextArea`: `showCount` with `maxLength`; the count is a small pill at the bottom right; over the limit it turns `colorError` and the text is kept. `autoSize` already exists.

## Other antd / rc surface found in lobe-ui

| Item                                                                                                        | Action                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Footer` uses `rc-footer` at runtime                                                                        | Reimplement on Flexbox with a local `columns` type; follow `2026-07-13-docs-site-footer-design.md`. Needs a board before implementation. |
| base-ui `DropdownMenu` / `ContextMenu` import `MenuInfo` from `rc-menu/es/interface`                        | Replace with a local type; do it in the first implementation PR.                                                                         |
| root `Collapse`, `Menu`, `Input` types import from `rc-collapse`, `rc-menu`, `rc-input-number`              | Removed with the legacy root components.                                                                                                 |
| `dependencies`: `rc-collapse`, `rc-footer`, `rc-image`, `rc-input-number`, `rc-menu`, `@ant-design/cssinjs` | Drop each once its last import is gone.                                                                                                  |

`antd-style` stays (owner decision, 2026-10-01): it is the CSS-in-JS and theme-token layer every component uses. Its own dependency on `@ant-design/cssinjs` stays with it. What goes, once `antd` is removed, is lobe-ui's direct use of `@ant-design/cssinjs`: the antd static-CSS extraction in `src/static-css/` and `packages/docs-kit/site/app/antdStaticCss.server.tsx`, plus the direct `@ant-design/cssinjs` entries in both `package.json` files.

## Files

Each component follows the standard layout under `src/base-ui/<Name>/`: `<Name>.tsx`, `type.ts`, `style.ts`, `index.ts`, `index.mdx`, `demos/`, `__tests__/`. New directories: `DatePicker` (exports `DatePicker`, `DateRangePicker`), `ColorPicker`, `QRCode`, `Burger`. Input gaps land in `src/base-ui/Input/`. Re-export everything from `src/base-ui/index.ts`.

## Testing

- DatePicker: month grid generation (6 rows, locale week start), min / max / disabledDate, range ordering (picking an end before the start swaps them), keyboard navigation, clear.
- ColorPicker: hex ↔ HSV round trip, alpha on/off output length, onChange vs onChangeComplete timing, preset click.
- QRCode: encoder output for a fixed string, icon forces error level H, status overlays and onRefresh.
- Burger: open / close via onOpenChange, onSelect, Esc closes, focus returns to the trigger.
- Input: IME composition suppresses onPressEnter, clear button visibility and focus retention, InputNumber format / precision, TextArea count and over-limit state.
- Browser check of every demo against the dev server (local-testing skill).
