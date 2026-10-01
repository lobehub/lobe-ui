# base-ui display batch (batch eight)

Five new display components in `@lobehub/ui/base-ui` — Divider, Statistic, Breadcrumb, Descriptions, Steps. antd `Card` is replaced by the existing `Block` with no new component. Goal: remove every downstream import of antd `Divider`, `Card`, `Statistic`, `Breadcrumb`, `Descriptions`, `Steps`.

Downstream numbers come from the 2026-09-26 sweep (lobehub canary `3112b80e`, lobehub-cloud PR #1844 branch, runtime imports only).

## Principles

- v1 covers the props downstream actually uses; everything else is listed under "Out".
- API closeness to antd is decided per component. Renames are listed explicitly so the migration is mechanical.
- Pure-display components are plain markup; only Divider sits on a `@base-ui/react` primitive (`Separator`).
- Every component ships the standard folder: `Component.tsx`, `type.ts`, `style.ts` (`createStaticStyles`), `index.ts`, `index.mdx`, `demos/`, `__tests__/`, and is re-exported from `src/base-ui/index.ts`.

## Divider

Downstream: 73 files, 98 calls. ~55 calls set `margin: 0` / `marginBlock: 0`; `dashed` ×36; `orientation="vertical"` ×7; legacy `type="vertical"` ×1; centered text ×3.

Built on `Separator` from `@base-ui/react/separator` (gives `role="separator"` and `aria-orientation`).

```ts
export interface DividerProps extends Omit<ComponentProps<'div'>, 'children'> {
  children?: ReactNode;
  dashed?: boolean;
  orientation?: 'horizontal' | 'vertical';
  ref?: Ref<HTMLDivElement>;
}
```

- Default margin is `0` in both orientations (antd uses 24px block / 8px inline). Deliberate: the migration deletes the ~55 `margin: 0` overrides; call sites that want spacing keep their `marginBlock`.
- Horizontal: `width: 100%`, 1px line. Vertical: `height: 1em`, inline, 1px line.
- Line color `colorBorderSecondary`; `dashed` switches the border style.
- `children` renders a centered label with lines on both sides; label is 12px `colorTextDescription`. When `children` is present the root is a flex row and the `Separator` role stays on the root.

Out: `type` (the one call migrates to `orientation`), `titlePlacement`, `orientationMargin`, `plain`, `variant`, `size`.

## Card → Block (no new component)

Downstream: 15 calls in 11 files.

- 11 calls are a styled container (`className`, `size="small"`, `styles.body.padding`) → `Block variant="outlined"` with the same className / padding.
- 1 call uses `title` + `extra` (`eval/features/Experiments/BenchmarksSection.tsx`) → `Block` with a hand-written `Flexbox` header row.
- 3 calls live in lobehub-cloud `src/business/client/WorkspaceSubscription/index.tsx` and `UsageDashboard.tsx`, which nothing imports → delete both files.

No change to `Block`.

## Statistic

Downstream (live): oss `src/components/StatisticCard` (the only oss consumer; 9 product call sites go through it) and cloud `devtools/agent-evals` (10 calls, 2 files). The 2 cloud `WorkspaceSubscription` files are deleted (see Card).

```ts
export interface StatisticProps extends Omit<ComponentProps<'div'>, 'title' | 'prefix'> {
  classNames?: { title?: string; value?: string };
  formatter?: (value: number | string | undefined) => ReactNode;
  loading?: boolean;
  precision?: number;
  prefix?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  styles?: { title?: CSSProperties; value?: CSSProperties };
  suffix?: ReactNode;
  title?: ReactNode;
  value?: number | string;
}
```

- Numbers format through `Intl.NumberFormat('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })`. The locale is fixed so SSR and client output match. Strings render as-is (agent-evals passes `"12 / 3"`, `"98.1%"`).
- `formatter` wins over the built-in formatting.
- Value: 24px, semibold, `tabular-nums`. Title: 14px `colorTextDescription`.
- `loading` swaps the value for a base-ui `Skeleton`.

Renames: `valueStyle` → `styles.value`.

Out: int/decimal split spans, `groupSeparator` / `decimalSeparator`, `Statistic.Countdown` / `Timer`.

Downstream follow-up: `StatisticCard` renders base-ui `Statistic` and drops its `.ant-statistic-content-value-*` overrides.

## Breadcrumb

Downstream: 6 files (oss only), all `items`-based. `title` ×18, `href` ×1, `onClick` ×1. Every call passes a `ChevronRight` icon as `separator`; at least 2 files override `.ant-breadcrumb-link` to center items vertically.

```ts
export interface BreadcrumbItem {
  href?: string;
  key?: Key;
  onClick?: MouseEventHandler<HTMLElement>;
  title: ReactNode;
}

export interface BreadcrumbProps extends Omit<ComponentProps<'nav'>, 'children'> {
  classNames?: { item?: string; separator?: string };
  items: BreadcrumbItem[];
  ref?: Ref<HTMLElement>;
  separator?: ReactNode;
  styles?: { item?: CSSProperties; separator?: CSSProperties };
}
```

- Markup: `nav[aria-label="breadcrumb"] > ol > li`; the last item gets `aria-current="page"`. Separators are `aria-hidden`.
- Default `separator` is a 14px `ChevronRight` `Icon` (antd defaults to `/`; every downstream call overrides it).
- Items with `href` render through lobe-ui `A`, so `ConfigProvider` `aAs` (a router `Link`) gives client-side navigation.
- Items and separators are flex-centered by default. Non-last items `colorTextDescription`, hover `colorText`; last item `colorText`.

Out: dropdown `menu` items, `itemRender`, `params`, route-path concatenation.

## Descriptions

Downstream: 5 files (oss only), 8 calls. All `size="small"`; `column` is 1 or 2; `items` of `{ label, children }`; `colon={false}` ×2; `labelStyle.width` ×2; `title` + `extra` ×1; `bordered` + `Descriptions.Item` ×1.

```ts
export interface DescriptionsItem {
  children?: ReactNode;
  key?: Key;
  label?: ReactNode;
  span?: number;
}

export interface DescriptionsProps extends Omit<ComponentProps<'div'>, 'title'> {
  bordered?: boolean;
  classNames?: { content?: string; label?: string };
  colon?: boolean;
  column?: number;
  extra?: ReactNode;
  items: DescriptionsItem[];
  ref?: Ref<HTMLDivElement>;
  styles?: { content?: CSSProperties; label?: CSSProperties };
  title?: ReactNode;
}
```

- Markup: optional header row (`title` left, `extra` right), then a `<dl>` laid out with CSS grid: `column` repetitions of `auto 1fr` (label, content). `span` stretches an item across that many label/content pairs.
- `column` defaults to 1. `colon` defaults to `true` (same as antd).
- One density only, matching antd `size="small"`.
- `bordered`: cell borders `colorBorderSecondary`, label background `colorFillQuaternary`.

Renames: `labelStyle` → `styles.label`. `size` is dropped. `Descriptions.Item` children form is not supported; the one call migrates to `items`.

Out: `layout="vertical"`, responsive `column` objects, `span: 'filled'`, `size`.

## Steps

Downstream: 8 files (oss only), 12 calls, used two ways:

- a real stepper: 1 call (`CreateCredModal`, horizontal, `current={step}`)
- a vertical guide list: 11 calls with `current={null as any}` or `-1`, `title` + `description`, often a custom `icon`, 1 `progressDot`

One component covers both.

```ts
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepItem {
  description?: ReactNode;
  icon?: ReactNode;
  key?: Key;
  status?: StepStatus;
  title?: ReactNode;
}

export interface StepsProps extends Omit<ComponentProps<'ol'>, 'children'> {
  classNames?: { description?: string; indicator?: string; item?: string; title?: string };
  current?: number;
  items: StepItem[];
  orientation?: 'horizontal' | 'vertical';
  ref?: Ref<HTMLOListElement>;
  styles?: {
    description?: CSSProperties;
    indicator?: CSSProperties;
    item?: CSSProperties;
    title?: CSSProperties;
  };
  variant?: 'default' | 'dot';
}
```

- Markup: `ol > li`; the `current` item gets `aria-current="step"`.
- Without `current` the list is a guide: every item renders neutral (no finish / wait distinction). This replaces the `current={null as any}` / `-1` hacks.
- With `current`, status is derived (`< current` finish, `=== current` process, `> current` wait); an item's own `status` overrides.
- Indicator: step number by default, check icon for `finish`, `icon` when given, a small dot for `variant="dot"`. Connectors between indicators use `colorBorderSecondary`; finished connectors use `colorPrimary`.
- `orientation` defaults to `horizontal` (antd default). Compact density only.

Renames: `direction` → `orientation`, `progressDot` → `variant="dot"`. `size` is dropped.

Out: `onChange` / clickable steps, `percent`, `labelPlacement`, `type="navigation" | "inline"`, `size`.

## Tests

One `__tests__/<Name>.test.tsx` per component, colocated:

- Divider: `role="separator"` + `aria-orientation` for both orientations; dashed style applied; children render a centered label.
- Statistic: thousands separators, `precision`, string passthrough, `formatter` override, `loading` shows a skeleton.
- Breadcrumb: `aria-current` on the last item, separators `aria-hidden` and count = items − 1, `href` items render a link, `onClick` fires.
- Descriptions: `column` sets grid tracks, `colon` toggles the colon, `span`, `bordered` class, `title` / `extra` header.
- Steps: status derivation from `current`, per-item `status` override, guide mode with no `current`, `aria-current`, dot variant.

## Docs

Each component gets `index.mdx` (frontmatter `title`, `description`, `category`) with demos: basic plus one demo per non-trivial option (Divider: vertical / dashed / with text; Steps: horizontal stepper / vertical guide / dot; Descriptions: two columns / bordered). Docs build validates frontmatter and demos.

## Downstream migration (after release)

- lobehub (canary): Divider 56 files, Card 8, Statistic via `StatisticCard` 1, Breadcrumb 6, Descriptions 5, Steps 8.
- lobehub-cloud (main): Divider 17 files, Card 1 (agent-evals) + delete `WorkspaceSubscription/index.tsx` and `UsageDashboard.tsx`, Statistic 2 (agent-evals).
- Mechanical rules: drop `margin: 0` / `marginBlock: 0` on Divider; `type="vertical"` → `orientation="vertical"`; `direction` → `orientation`; `progressDot` → `variant="dot"`; drop `size` on Descriptions / Steps; `valueStyle` / `labelStyle` → `styles.value` / `styles.label`; remove `.ant-breadcrumb-*`, `.ant-steps-*`, `.ant-statistic-*` overrides.

## Lint ban (separate PR, after downstream migrates)

Add `antd/{es,lib}/{divider,card,statistic,breadcrumb,descriptions,steps}` path patterns and the `antd` named imports `Divider`, `Card`, `Statistic`, `Breadcrumb`, `Descriptions`, `Steps` to `src/eslint/index.ts`. `DEPRECATED_UI_COMPONENTS` is shared between the `@lobehub/ui` and `antd` rules, so these names need their own `antd`-only entry to avoid banning unrelated root exports.

## lobe-ui internal follow-ups unlocked

`src/Accordion`, `src/chat/ChatList`, and `src/Form` import antd `Divider`; switch them to base-ui `Divider` in the same PR.
