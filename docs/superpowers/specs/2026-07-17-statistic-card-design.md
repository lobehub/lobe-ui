# StatisticCard Design

Date: 2026-07-17
Linear: [LOBE-11988](https://linear.app/lobehub/issue/LOBE-11988) — remove legacy `@ant-design/pro-components` references

## Background

lobe-chat wraps `StatisticCard` from `@ant-design/pro-components` (`src/components/StatisticCard`) with ~100 lines of CSS overriding `ant-pro-*` class names. The issue asks to drop the pro-components dependency and move StatisticCard into the component library. This spec covers the lobe-ui side only: build a self-contained StatisticCard family. Replacing the usages in lobe-chat (ProTable, ProDescriptions, StatisticCard) is a separate follow-up outside this spec.

The component must NOT depend on `@ant-design/pro-components` or any antd runtime component. Implementation follows the conventions of this repo's `src/base-ui/` components (self-drawn styles, `cva` variants, `classNames`/`styles` slot props, `cssVar` tokens, `prefers-reduced-motion` support), but lives at top-level `src/` since it is a display component with no `@base-ui/react` primitive.

## Scope

In scope (all in lobe-ui, exported from `@lobehub/ui`):

- `StatisticCard` — the card itself
- `Statistic` — small label + value pair, used in the card's `description` slot
- `TitleWithPercentage` — title with a growth-percentage tag, used in the card's `title` slot

Out of scope: any lobe-chat changes; chart/footer features of the pro-components original (no caller uses them).

## File structure

```
src/StatisticCard/
  StatisticCard.tsx
  Statistic.tsx
  TitleWithPercentage.tsx
  utils.ts            # calcGrowthPercentage
  type.ts
  style.ts            # createStaticStyles + cva variants
  index.ts
  index.mdx           # category: Data Display
  demos/index.tsx     # StoryBook + leva controls
```

`src/index.ts` adds: `StatisticCard`, `Statistic`, `TitleWithPercentage` and their prop types.

## API

```ts
type StatisticCardSlot =
  'root' | 'header' | 'title' | 'extra' | 'content' | 'value' | 'description';

interface StatisticCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix' | 'title'> {
  title?: ReactNode; // string is wrapped in Text h2 with single-line ellipsis + tooltip
  extra?: ReactNode; // top-right slot; replaced by spinner while loading
  loading?: boolean;
  value?: ReactNode; // number → toFixed(precision); undefined/null → '--'
  precision?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: ReactNode; // rendered below the value
  variant?: 'filled' | 'outlined' | 'borderless'; // default 'borderless'
  classNames?: Partial<Record<StatisticCardSlot, string>>;
  styles?: Partial<Record<StatisticCardSlot, CSSProperties>>;
  ref?: Ref<HTMLDivElement>;
}

interface StatisticProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  value: ReactNode;
}

interface TitleWithPercentageProps {
  title: string;
  count?: number;
  prvCount?: number;
  inverseColor?: boolean; // swap up/down colors (e.g. for spend metrics)
}
```

This flat API covers the full set of props actually used by the 8 lobe-chat call sites (`statistic.{value, precision, prefix, description, style}`, `title`, `extra`, `loading`, `variant`). The old `statistic.style` maps to `styles.value`.

## Rendering

- Root: self-drawn `div` (no `Block`), `cva` variants:
  - `borderless` (default): no border, transparent background
  - `outlined`: 1px border (`colorFillSecondary` light / `colorFillTertiary` dark), `borderRadiusLG`
  - `filled`: `colorFillQuaternary` background, `borderRadiusLG`
- Layout: vertical `Flexbox` — header row (title left, extra right), value row (prefix + value + suffix, 24px bold, line-height 1.2), then description.
- Loading: `Icon` + `Loader2` with a rotation keyframe (same pattern as base-ui `Switch`), shown in the extra slot; animation duration 0 under `prefers-reduced-motion`.
- Responsive: under `responsive.sm` the card drops border and radius and uses `colorBgContainer` background (matches current lobe-chat mobile behavior).
- All colors via `cssVar` tokens; no dark-mode branching in JS except where token pairs differ per variant (handled in `style.ts`).

## Companion components

- `Statistic`: horizontal `Flexbox`, bold value + normal-weight title, 12px, `colorTextDescription`. Logic ported as-is from lobe-chat, inline styles moved to `style.ts`.
- `TitleWithPercentage`: ports `calcGrowthPercentage` and the Tag rendering from lobe-chat unchanged; percentage tag only renders when `count`, `prvCount`, and a non-zero percentage are all present. Up = `colorSuccess`, down = `colorWarning`, swapped when `inverseColor`.

## Edge cases

- `value` undefined or null → renders `'--'`, precision not applied.
- `precision` applies only when `value` is a `number`.
- `title` given as ReactNode is rendered as-is (no Text wrapper).

## Verification

- Demo page: check light/dark themes, mobile viewport, and loading state via the docs dev server.
- Lint scoped to the new/changed files only.
- No new runtime dependency; `@ant-design/pro-components` is never added to lobe-ui.
