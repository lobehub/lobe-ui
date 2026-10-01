# base-ui Batches 8–10 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add seven antd-free components to `@lobehub/ui/base-ui` — Divider, Statistic, Breadcrumb, Descriptions, Steps, List, Table — and move lobe-ui's own Accordion and ChatList `HistoryDivider` off antd `Divider`.

**Architecture:** Each component is a self-contained folder under `src/base-ui/<Name>/` (implementation, `type.ts`, `style.ts` with `createStaticStyles`, `index.ts`, `index.mdx`, `demos/`, `__tests__/`) and is re-exported from `src/base-ui/index.ts`. Divider wraps the `@base-ui/react` `Separator` primitive; Table wraps TanStack Table v9 (`useTable` + module-scope `tableFeatures`) behind an antd-shaped `columns` / `dataSource` API; the rest are plain markup.

**Tech Stack:** React 19, TypeScript, `antd-style` (`createStaticStyles`, `cssVar`, `cx`), `@base-ui/react` 1.8.0, `@tanstack/react-table` 9.2.4, `lucide-react`, Vitest + jsdom + `@testing-library/react` (`fireEvent`; there is no `user-event`).

**Specs:**

- `docs/superpowers/specs/2026-09-26-base-ui-display-batch-design.md` (Divider, Card→Block, Statistic, Breadcrumb, Descriptions, Steps)
- `docs/superpowers/specs/2026-09-26-base-ui-list-confirm-design.md` (List; Popconfirm→confirmModal is downstream-only)
- `docs/superpowers/specs/2026-09-26-base-ui-table-design.md` (Table)

## Global Constraints

- Work on branch `feat/base-ui-batches-8-10` cut from `master`.
- Zero comments / JSDoc in new code unless a line carries a non-obvious workaround (user rule).
- Files under 500 lines; React components under 300 lines.
- Every new component folder: `<Name>.tsx`, `type.ts`, `style.ts`, `index.ts`, `index.mdx`, `demos/index.tsx`, `__tests__/<Name>.test.tsx`.
- `src/base-ui/index.ts` export pattern: `export { default as <Name> } from './<Name>';` then `export * from './<Name>';`, kept alphabetical.
- Demos import from `@lobehub/ui/base-ui` (and layout helpers like `Flexbox` from `@lobehub/ui`).
- Styles use `createStaticStyles(({ css, cssVar }) => ({ ... }))` and lobe tokens only (`colorBorderSecondary`, `colorTextDescription`, `colorText`, `colorFillQuaternary`, `colorFillTertiary`, `colorFillSecondary`, `colorError`, `colorPrimary`, `colorBgContainer`, `borderRadius`, `borderRadiusLG`).
- Divider default margin is `0` in both orientations.
- Statistic number formatting uses `Intl.NumberFormat('en-US')` (fixed locale).
- Breadcrumb default separator is a 14px `ChevronRight` `Icon`; `href` items render through lobe-ui `A`.
- Descriptions: `column` default `1`, `colon` default `true`, single compact density, no `size` prop.
- Steps: no `current` ⇒ guide mode (no statuses); `orientation` default `'horizontal'`.
- List: single-select `activeKey`; rows are `button` or `A`; `aria-current` on the active row.
- Table: `@tanstack/react-table@^9.2.4` in `dependencies`; v9 API only (`useTable`, `tableFeatures`, `sortFn`, `filterFn`) — never v8 `useReactTable` / `getCoreRowModel`. `locale.emptyText` is replaced by `emptyText`. Default `size` is `'middle'`, default page size `10`.
- Lint / type-check only changed files: `pnpm exec eslint <paths>`; `pnpm exec tsc --noEmit 2>&1 | grep '<path>'` must print nothing.
- Commit after each task with gitmoji messages (`✨ feat(base-ui): …`, `♻️ refactor(…): …`). Never add AI co-authorship.

Out of this plan (decided while planning):

- `src/Burger`: its public props are antd types (`MenuProps['items']`, `openKeys`, `DrawerProps`) and nothing downstream uses it. Rewriting it on List is a breaking API change; handle it as its own decision (deprecate or rewrite) later.
- `src/Form/components/FormDivider`: `FormDividerProps` extends antd `DividerProps`, and the root Form is an antd Form wrapper. It moves with the Form migration track.
- Table `fixed` columns use CSS `position: sticky` with offsets summed from the numeric `width` of the other fixed columns on the same side, instead of TanStack `columnPinningFeature` (v9 pinning offsets come from `columnSizingFeature`, which this table does not use). Downstream has one `fixed: 'right'` column.
- List dividers render as a styled `li[role="separator"]` rather than nesting a `Divider` (which would put a second `separator` role inside the first).

## Review Focus

- Table: filtering while on a later page leaves fewer pages than the current page — the table must show page 1, not an empty page. (Task 9 test)
- Table: `dataSource` shrinks while on a later page (a row deleted on the last page) — the page index must clamp to the last existing page. (Task 8 test)
- Statistic: negative numbers and exponent-notation numbers — `-1234` renders `-1,234`, `1e-7` renders `1e-7`, `NaN` renders `NaN`. (Task 2 test)
- List: numeric keys, including `0` — `activeKey={0}` must mark the first row active. (Task 6 test)
- Steps / Breadcrumb / Descriptions edge inputs — `current` past the last step marks all finished; a single breadcrumb item renders no separator; `span` larger than `column` is clamped. (Tasks 3, 4, 5 tests)

---

### Task 1: Divider, and move Accordion + HistoryDivider onto it

**Files:**

- Create: `src/base-ui/Divider/Divider.tsx`, `src/base-ui/Divider/type.ts`, `src/base-ui/Divider/style.ts`, `src/base-ui/Divider/index.ts`, `src/base-ui/Divider/index.mdx`, `src/base-ui/Divider/demos/index.tsx`
- Test: `src/base-ui/Divider/__tests__/Divider.test.tsx`
- Modify: `src/base-ui/index.ts` (add export), `src/Accordion/Accordion.tsx:3,141`, `src/chat/ChatList/components/HistoryDivider.tsx`

**Interfaces:**

- Produces: `DividerProps { children?: ReactNode; dashed?: boolean; orientation?: 'horizontal' | 'vertical'; ref?: Ref<HTMLDivElement> } & Omit<ComponentProps<'div'>, 'children'>`; default export `Divider`; type `DividerOrientation`.

- [ ] **Step 1: Create the branch**

```bash
git switch -c feat/base-ui-batches-8-10 master
```

- [ ] **Step 2: Write the failing test**

`src/base-ui/Divider/__tests__/Divider.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react';

import Divider from '../Divider';

describe('Divider', () => {
  afterEach(cleanup);

  test('renders a horizontal separator by default', () => {
    render(<Divider />);

    const separator = screen.getByRole('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
  });

  test('renders a vertical separator', () => {
    render(<Divider orientation="vertical" />);

    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
  });

  test('dashed changes the class list', () => {
    const { container, rerender } = render(<Divider />);
    const plain = container.firstElementChild!.className;

    rerender(<Divider dashed />);

    expect(container.firstElementChild!.className).not.toBe(plain);
  });

  test('renders children as a centered label inside the separator', () => {
    render(<Divider>OR</Divider>);

    expect(screen.getByRole('separator').textContent).toBe('OR');
  });

  test('forwards className and style', () => {
    render(<Divider className="custom" style={{ marginBlock: 12 }} />);

    const separator = screen.getByRole('separator');
    expect(separator.className).toContain('custom');
    expect(separator.getAttribute('style')).toContain('margin-block: 12px');
  });

  test('sets the displayName', () => {
    expect(Divider.displayName).toBe('Divider');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Divider`
Expected: FAIL — `Cannot find module '../Divider'`.

- [ ] **Step 4: Implement**

`src/base-ui/Divider/type.ts`:

```ts
import type { ComponentProps, ReactNode, Ref } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends Omit<ComponentProps<'div'>, 'children'> {
  children?: ReactNode;
  dashed?: boolean;
  orientation?: DividerOrientation;
  ref?: Ref<HTMLDivElement>;
}
```

`src/base-ui/Divider/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  dashed: css`
    border-style: dashed;

    &::before,
    &::after {
      border-block-start-style: dashed;
    }
  `,
  horizontal: css`
    flex-shrink: 0;

    width: 100%;
    height: 0;
    margin: 0;
    border: 0;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  text: css`
    flex: none;
    font-size: 12px;
    line-height: 1.5;
    color: ${cssVar.colorTextDescription};
  `,
  vertical: css`
    display: inline-block;
    flex-shrink: 0;
    align-self: center;

    width: 0;
    height: 1em;
    margin: 0;
    border: 0;
    border-inline-start: 1px solid ${cssVar.colorBorderSecondary};

    vertical-align: middle;
  `,
  withText: css`
    display: flex;
    gap: 12px;
    align-items: center;

    width: 100%;
    margin: 0;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }
  `,
}));
```

`src/base-ui/Divider/Divider.tsx`:

```tsx
'use client';

import { Separator } from '@base-ui/react/separator';
import { cx } from 'antd-style';
import { memo } from 'react';

import { styles } from './style';
import type { DividerProps } from './type';

const Divider = memo<DividerProps>(
  ({ children, className, dashed = false, orientation = 'horizontal', ref, ...rest }) => {
    if (children != null && orientation === 'horizontal') {
      return (
        <Separator
          className={cx(styles.withText, dashed && styles.dashed, className)}
          orientation="horizontal"
          ref={ref}
          {...rest}
        >
          <span className={styles.text}>{children}</span>
        </Separator>
      );
    }

    return (
      <Separator
        orientation={orientation}
        ref={ref}
        className={cx(
          orientation === 'vertical' ? styles.vertical : styles.horizontal,
          dashed && styles.dashed,
          className,
        )}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';

export default Divider;
```

`src/base-ui/Divider/index.ts`:

```ts
export { default } from './Divider';
export type { DividerOrientation, DividerProps } from './type';
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/Divider`
Expected: PASS (6 tests).

- [ ] **Step 6: Export, docs, demo**

`src/base-ui/index.ts` — insert after the `controlSize` line:

```ts
export { default as Divider } from './Divider';
export * from './Divider';
```

`src/base-ui/Divider/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { Divider } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={24} padding={16}>
      <Flexbox>
        <div style={{ padding: '10px 0' }}>Model provider</div>
        <Divider />
        <div style={{ padding: '10px 0' }}>Default model</div>
        <Divider dashed />
        <div style={{ padding: '10px 0' }}>Context window</div>
      </Flexbox>
      <Flexbox horizontal align="center" gap={12}>
        <span>Copy</span>
        <Divider orientation="vertical" />
        <span>Edit</span>
        <Divider orientation="vertical" />
        <span>Delete</span>
      </Flexbox>
      <Divider>OR</Divider>
    </Flexbox>
  );
};
```

`src/base-ui/Divider/index.mdx`:

````mdx
---
title: Divider
description: A thin separator line between content, horizontal or vertical, with an optional centered label.
category: Layout
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="Divider" from=".." />

`Divider` renders the `@base-ui/react` `Separator` (`role="separator"`, `aria-orientation`). Standard div attributes are forwarded.

The default margin is `0` in both orientations. Add `style={{ marginBlock: 12 }}` where spacing is wanted.

### Migrating from antd Divider

```tsx | pure
import { Divider } from '@lobehub/ui/base-ui';

<Divider dashed />;
<Divider orientation="vertical" />;
```

- Remove `style={{ margin: 0 }}` / `marginBlock: 0` overrides; they are the default now.
- `type="vertical"` → `orientation="vertical"`.
- `titlePlacement`, `orientationMargin`, `plain`, `variant` and `size` are not supported.
````

- [ ] **Step 7: Move lobe-ui internals onto base-ui Divider**

`src/Accordion/Accordion.tsx` — replace line 3 `import { Divider } from 'antd';` with:

```ts
import Divider from '@/base-ui/Divider';
```

Line 141 stays `<Divider className={styles.divider} />` (the `divider` style already sets `margin-block: 0`).

`src/chat/ChatList/components/HistoryDivider.tsx` — full file:

```tsx
import { Timer } from 'lucide-react';
import { type FC } from 'react';

import Divider from '@/base-ui/Divider';
import Icon from '@/Icon';
import Tag from '@/Tag';

interface HistoryDividerProps {
  enable?: boolean;
  text?: string;
}

const HistoryDivider: FC<HistoryDividerProps> = ({ enable, text }) => {
  if (!enable) return null;

  return (
    <div style={{ padding: '0 20px' }}>
      <Divider style={{ marginBlock: 16 }}>
        <Tag icon={<Icon icon={Timer} />}>{text || 'History Message'}</Tag>
      </Divider>
    </div>
  );
};

export default HistoryDivider;
```

- [ ] **Step 8: Verify**

Run: `pnpm vitest run src/base-ui/Divider src/Accordion src/chat/ChatList`
Expected: PASS.

Run: `pnpm exec eslint src/base-ui/Divider src/base-ui/index.ts src/Accordion/Accordion.tsx src/chat/ChatList/components/HistoryDivider.tsx`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/(base-ui/Divider|base-ui/index|Accordion|chat/ChatList)'`
Expected: no output.

- [ ] **Step 9: Commit**

```bash
git add src/base-ui/Divider src/base-ui/index.ts src/Accordion/Accordion.tsx src/chat/ChatList/components/HistoryDivider.tsx
git commit -m "✨ feat(base-ui): add Divider and move Accordion and HistoryDivider off antd"
```

---

### Task 2: Statistic

**Files:**

- Create: `src/base-ui/Statistic/Statistic.tsx`, `src/base-ui/Statistic/formatValue.ts`, `src/base-ui/Statistic/type.ts`, `src/base-ui/Statistic/style.ts`, `src/base-ui/Statistic/index.ts`, `src/base-ui/Statistic/index.mdx`, `src/base-ui/Statistic/demos/index.tsx`
- Test: `src/base-ui/Statistic/__tests__/Statistic.test.tsx`
- Modify: `src/base-ui/index.ts`

**Interfaces:**

- Consumes: `Skeleton` default export from `@/base-ui/Skeleton` (`width`, `height` props).
- Produces: `StatisticProps`; default export `Statistic`; `formatStatisticValue(value: number | string | undefined, precision?: number): string`.

- [ ] **Step 1: Write the failing test**

`src/base-ui/Statistic/__tests__/Statistic.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react';

import { formatStatisticValue } from '../formatValue';
import Statistic from '../Statistic';

describe('formatStatisticValue', () => {
  test.each([
    [1284390, undefined, '1,284,390'],
    [-1234, undefined, '-1,234'],
    [3.14159, undefined, '3.14159'],
    [42.5, 2, '42.50'],
    [1234.567, 1, '1,234.6'],
    [1e-7, undefined, '1e-7'],
    [Number.NaN, undefined, 'NaN'],
    ['12 / 3', undefined, '12 / 3'],
    [undefined, undefined, ''],
  ])('formats %s with precision %s as %s', (value, precision, expected) => {
    expect(formatStatisticValue(value as number | string | undefined, precision)).toBe(expected);
  });
});

describe('Statistic', () => {
  afterEach(cleanup);

  test('renders the title and the formatted value', () => {
    render(<Statistic title="Total tokens" value={1284390} />);

    expect(screen.getByText('Total tokens')).toBeTruthy();
    expect(screen.getByText('1,284,390')).toBeTruthy();
  });

  test('renders prefix and suffix around the value', () => {
    render(<Statistic precision={2} prefix="$" suffix="/ mo" value={42.5} />);

    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('42.50')).toBeTruthy();
    expect(screen.getByText('/ mo')).toBeTruthy();
  });

  test('formatter overrides the built-in formatting', () => {
    render(<Statistic formatter={(value) => `~${value}`} value={1000} />);

    expect(screen.getByText('~1000')).toBeTruthy();
  });

  test('loading hides the value and keeps the title', () => {
    render(<Statistic loading title="Credits" value={1000} />);

    expect(screen.getByText('Credits')).toBeTruthy();
    expect(screen.queryByText('1,000')).toBeNull();
  });

  test('applies styles.value to the value element', () => {
    render(<Statistic styles={{ value: { color: 'rgb(1, 2, 3)' } }} value={7} />);

    expect(screen.getByText('7').parentElement!.getAttribute('style')).toContain('rgb(1, 2, 3)');
  });

  test('sets the displayName', () => {
    expect(Statistic.displayName).toBe('Statistic');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Statistic`
Expected: FAIL — cannot find `../formatValue` / `../Statistic`.

- [ ] **Step 3: Implement**

`src/base-ui/Statistic/formatValue.ts`:

```ts
const grouping = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatStatisticValue = (
  value: number | string | undefined,
  precision?: number,
): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (!Number.isFinite(value)) return String(value);

  if (precision !== undefined) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    }).format(value);
  }

  const raw = String(value);
  if (raw.includes('e')) return raw;

  const [integer, decimal] = raw.split('.');
  const grouped = grouping.format(Number(integer));

  return decimal ? `${grouped}.${decimal}` : grouped;
};
```

`src/base-ui/Statistic/type.ts`:

```ts
import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

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

`src/base-ui/Statistic/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  affix: css`
    font-size: 14px;
    font-weight: 400;
    color: ${cssVar.colorTextSecondary};
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  title: css`
    font-size: 14px;
    line-height: 1.5;
    color: ${cssVar.colorTextDescription};
  `,
  value: css`
    display: flex;
    gap: 4px;
    align-items: baseline;

    font-size: 24px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.25;
    color: ${cssVar.colorText};
  `,
}));
```

`src/base-ui/Statistic/Statistic.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import Skeleton from '@/base-ui/Skeleton';

import { formatStatisticValue } from './formatValue';
import { styles } from './style';
import type { StatisticProps } from './type';

const Statistic = memo<StatisticProps>(
  ({
    className,
    classNames,
    formatter,
    loading = false,
    precision,
    prefix,
    ref,
    styles: customStyles,
    suffix,
    title,
    value,
    ...rest
  }) => {
    return (
      <div className={cx(styles.root, className)} ref={ref} {...rest}>
        {title != null && (
          <div className={cx(styles.title, classNames?.title)} style={customStyles?.title}>
            {title}
          </div>
        )}
        {loading ? (
          <Skeleton height={30} width={96} />
        ) : (
          <div className={cx(styles.value, classNames?.value)} style={customStyles?.value}>
            {prefix != null && <span className={styles.affix}>{prefix}</span>}
            <span>{formatter ? formatter(value) : formatStatisticValue(value, precision)}</span>
            {suffix != null && <span className={styles.affix}>{suffix}</span>}
          </div>
        )}
      </div>
    );
  },
);

Statistic.displayName = 'Statistic';

export default Statistic;
```

`src/base-ui/Statistic/index.ts`:

```ts
export { formatStatisticValue } from './formatValue';
export { default } from './Statistic';
export type { StatisticProps } from './type';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/Statistic`
Expected: PASS (15 tests).

- [ ] **Step 5: Export, docs, demo**

`src/base-ui/index.ts` — insert after the `Spin` lines:

```ts
export { default as Statistic } from './Statistic';
export * from './Statistic';
```

`src/base-ui/Statistic/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { Statistic } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox horizontal gap={40} padding={16} wrap="wrap">
      <Statistic title="Total tokens" value={1284390} />
      <Statistic precision={2} prefix="$" title="Credits used" value={42.5} />
      <Statistic styles={{ value: { color: '#379d4a' } }} title="Pass rate" value="94.1%" />
      <Statistic suffix="/ 7" title="Pass / Fail" value={112} />
      <Statistic loading title="Loading" value={0} />
    </Flexbox>
  );
};
```

`src/base-ui/Statistic/index.mdx`:

```mdx
---
title: Statistic
description: A labeled number with thousands separators, fixed precision, prefix and suffix.
category: Data Display
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="Statistic" from=".." />

Numbers format through `Intl.NumberFormat('en-US')`: thousands separators always, `precision` fixes the decimal places. Strings render unchanged. `formatter` replaces the built-in formatting. `loading` swaps the value for a skeleton.

### Migrating from antd Statistic

- `valueStyle` → `styles.value`.
- `groupSeparator`, `decimalSeparator`, `Statistic.Countdown` and `Statistic.Timer` are not supported.
```

- [ ] **Step 6: Verify**

Run: `pnpm exec eslint src/base-ui/Statistic src/base-ui/index.ts`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/(Statistic|index)'`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/Statistic src/base-ui/index.ts
git commit -m "✨ feat(base-ui): add Statistic"
```

---

### Task 3: Breadcrumb

**Files:**

- Create: `src/base-ui/Breadcrumb/Breadcrumb.tsx`, `src/base-ui/Breadcrumb/type.ts`, `src/base-ui/Breadcrumb/style.ts`, `src/base-ui/Breadcrumb/index.ts`, `src/base-ui/Breadcrumb/index.mdx`, `src/base-ui/Breadcrumb/demos/index.tsx`
- Test: `src/base-ui/Breadcrumb/__tests__/Breadcrumb.test.tsx`
- Modify: `src/base-ui/index.ts`

**Interfaces:**

- Consumes: `A` default export from `@/A` (anchor that honors `ConfigProvider` `aAs`); `Icon` default export from `@/Icon`.
- Produces: `BreadcrumbItem`, `BreadcrumbProps`; default export `Breadcrumb`.

- [ ] **Step 1: Write the failing test**

`src/base-ui/Breadcrumb/__tests__/Breadcrumb.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb', () => {
  afterEach(cleanup);

  test('renders a labelled nav with an ordered list', () => {
    render(<Breadcrumb items={[{ title: 'Home' }, { title: 'Settings' }]} />);

    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav.querySelector('ol')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  test('marks the last item as the current page', () => {
    render(<Breadcrumb items={[{ title: 'Home' }, { title: 'Settings' }]} />);

    const items = screen.getAllByRole('listitem');
    expect(items[1].getAttribute('aria-current')).toBe('page');
    expect(items[0].getAttribute('aria-current')).toBeNull();
  });

  test('renders one hidden separator between each pair of items', () => {
    const { container } = render(
      <Breadcrumb items={[{ title: 'A' }, { title: 'B' }, { title: 'C' }]} separator="/" />,
    );

    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(2);
    expect(separators[0].textContent).toBe('/');
  });

  test('a single item renders no separator', () => {
    const { container } = render(<Breadcrumb items={[{ title: 'Only' }]} />);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  test('renders href items as links', () => {
    render(<Breadcrumb items={[{ href: '/home', title: 'Home' }, { title: 'Now' }]} />);

    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/home');
  });

  test('renders onClick items as buttons and fires the handler', () => {
    const onClick = vi.fn();
    render(<Breadcrumb items={[{ onClick, title: 'Back' }, { title: 'Now' }]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('renders an empty nav for no items', () => {
    render(<Breadcrumb items={[]} />);

    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('sets the displayName', () => {
    expect(Breadcrumb.displayName).toBe('Breadcrumb');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Breadcrumb`
Expected: FAIL — cannot find `../Breadcrumb`.

- [ ] **Step 3: Implement**

`src/base-ui/Breadcrumb/type.ts`:

```ts
import type { ComponentProps, CSSProperties, Key, MouseEventHandler, ReactNode, Ref } from 'react';

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

`src/base-ui/Breadcrumb/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  button: css`
    cursor: pointer;

    padding: 0;
    border: 0;

    font: inherit;
    color: inherit;

    background: none;
  `,
  item: css`
    display: flex;
    gap: 4px;
    align-items: center;

    color: ${cssVar.colorTextDescription};

    &[aria-current='page'] {
      font-weight: 500;
      color: ${cssVar.colorText};
    }
  `,
  link: css`
    border-radius: 4px;
    color: inherit;
    text-decoration: none;
  `,
  list: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;

    margin: 0;
    padding: 0;

    list-style: none;
  `,
  root: css`
    font-size: 14px;
    line-height: 1.5;

    & a:hover,
    & button:hover {
      color: ${cssVar.colorText};
    }
  `,
  separator: css`
    display: inline-flex;
    align-items: center;
    color: ${cssVar.colorTextQuaternary};
  `,
}));
```

`src/base-ui/Breadcrumb/Breadcrumb.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { ChevronRight } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import A from '@/A';
import Icon from '@/Icon';

import { styles } from './style';
import type { BreadcrumbItem, BreadcrumbProps } from './type';

const renderTitle = (item: BreadcrumbItem): ReactNode => {
  if (item.href) {
    return (
      <A className={styles.link} href={item.href} onClick={item.onClick}>
        {item.title}
      </A>
    );
  }

  if (item.onClick) {
    return (
      <button className={styles.button} type="button" onClick={item.onClick}>
        {item.title}
      </button>
    );
  }

  return item.title;
};

const Breadcrumb = memo<BreadcrumbProps>(
  ({ className, classNames, items, ref, separator, styles: customStyles, ...rest }) => {
    const separatorNode = separator ?? <Icon icon={ChevronRight} size={14} />;

    return (
      <nav aria-label="breadcrumb" className={cx(styles.root, className)} ref={ref} {...rest}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                aria-current={isLast ? 'page' : undefined}
                className={cx(styles.item, classNames?.item)}
                key={item.key ?? index}
                style={customStyles?.item}
              >
                {renderTitle(item)}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cx(styles.separator, classNames?.separator)}
                    style={customStyles?.separator}
                  >
                    {separatorNode}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
```

`src/base-ui/Breadcrumb/index.ts`:

```ts
export { default } from './Breadcrumb';
export type { BreadcrumbItem, BreadcrumbProps } from './type';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/Breadcrumb`
Expected: PASS (8 tests).

- [ ] **Step 5: Export, docs, demo**

`src/base-ui/index.ts` — insert after the `Badge` lines:

```ts
export { default as Breadcrumb } from './Breadcrumb';
export * from './Breadcrumb';
```

`src/base-ui/Breadcrumb/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { Breadcrumb } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={16} padding={16}>
      <Breadcrumb items={[{ href: '#', title: 'Writing assistant' }, { title: 'Usage & cost' }]} />
      <Breadcrumb
        style={{ fontSize: 12 }}
        items={[
          { href: '#', title: 'Home' },
          { href: '#', title: 'Evals' },
          { href: '#', title: 'Agent Bench v3' },
          { title: 'Case #1042' },
        ]}
      />
      <Breadcrumb items={[{ title: 'Docs' }, { title: 'Guides' }]} separator="/" />
    </Flexbox>
  );
};
```

`src/base-ui/Breadcrumb/index.mdx`:

```mdx
---
title: Breadcrumb
description: A trail of links to the current page, with a chevron separator and router-aware links.
category: Navigation
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="Breadcrumb" from=".." />

Renders `nav[aria-label="breadcrumb"] > ol > li`. The last item gets `aria-current="page"`; separators are `aria-hidden`. Items with `href` render through lobe-ui `A`, so a router `Link` set as `ConfigProvider` `aAs` navigates client-side. Items with only `onClick` render as buttons.

### Migrating from antd Breadcrumb

- The default `separator` is a chevron icon; drop explicit `separator={<Icon icon={ChevronRight} />}`.
- Items are vertically centered by default; delete `.ant-breadcrumb-*` overrides.
- Dropdown `menu` items, `itemRender`, `params` and route-path concatenation are not supported.
```

- [ ] **Step 6: Verify**

Run: `pnpm exec eslint src/base-ui/Breadcrumb src/base-ui/index.ts`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/(Breadcrumb|index)'`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/Breadcrumb src/base-ui/index.ts
git commit -m "✨ feat(base-ui): add Breadcrumb"
```

---

### Task 4: Descriptions

**Files:**

- Create: `src/base-ui/Descriptions/Descriptions.tsx`, `src/base-ui/Descriptions/type.ts`, `src/base-ui/Descriptions/style.ts`, `src/base-ui/Descriptions/index.ts`, `src/base-ui/Descriptions/index.mdx`, `src/base-ui/Descriptions/demos/index.tsx`
- Test: `src/base-ui/Descriptions/__tests__/Descriptions.test.tsx`
- Modify: `src/base-ui/index.ts`

**Interfaces:**

- Produces: `DescriptionsItem`, `DescriptionsProps`; default export `Descriptions`.

- [ ] **Step 1: Write the failing test**

`src/base-ui/Descriptions/__tests__/Descriptions.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react';

import Descriptions from '../Descriptions';

const items = [
  { children: '3,482', key: 'words', label: 'Words' },
  { children: 'jina', key: 'crawler', label: 'Crawler' },
];

describe('Descriptions', () => {
  afterEach(cleanup);

  test('renders label and content pairs in a dl', () => {
    const { container } = render(<Descriptions items={items} />);

    expect(container.querySelectorAll('dl > dt')).toHaveLength(2);
    expect(container.querySelectorAll('dl > dd')).toHaveLength(2);
    expect(screen.getByText('jina')).toBeTruthy();
  });

  test('appends a colon to labels by default', () => {
    const { container } = render(<Descriptions items={items} />);

    expect(container.querySelector('dt')!.textContent).toBe('Words:');
  });

  test('colon={false} drops the colon', () => {
    const { container } = render(<Descriptions colon={false} items={items} />);

    expect(container.querySelector('dt')!.textContent).toBe('Words');
  });

  test('column sets the grid tracks', () => {
    const { container } = render(<Descriptions column={2} items={items} />);

    expect(container.querySelector('dl')!.getAttribute('style')).toContain(
      'repeat(2, auto minmax(0, 1fr))',
    );
  });

  test('span stretches the content cell and is clamped to column', () => {
    const { container } = render(
      <Descriptions column={2} items={[{ children: 'wide', label: 'Wide', span: 5 }]} />,
    );

    expect(container.querySelector('dd')!.getAttribute('style')).toContain('span 3');
  });

  test('renders title and extra in a header', () => {
    render(
      <Descriptions extra={<button type="button">Download</button>} items={items} title="Basic" />,
    );

    expect(screen.getByText('Basic')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
  });

  test('bordered changes the list class', () => {
    const { container, rerender } = render(<Descriptions items={items} />);
    const plain = container.querySelector('dl')!.className;

    rerender(<Descriptions bordered items={items} />);

    expect(container.querySelector('dl')!.className).not.toBe(plain);
  });

  test('styles.label applies to every label', () => {
    const { container } = render(<Descriptions items={items} styles={{ label: { width: 120 } }} />);

    expect(container.querySelector('dt')!.getAttribute('style')).toContain('width: 120px');
  });

  test('sets the displayName', () => {
    expect(Descriptions.displayName).toBe('Descriptions');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Descriptions`
Expected: FAIL — cannot find `../Descriptions`.

- [ ] **Step 3: Implement**

`src/base-ui/Descriptions/type.ts`:

```ts
import type { ComponentProps, CSSProperties, Key, ReactNode, Ref } from 'react';

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

`src/base-ui/Descriptions/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bordered: css`
    gap: 0;

    border: 1px solid ${cssVar.colorBorderSecondary};
    border-block-start: 0;
    border-radius: ${cssVar.borderRadius};

    & > dt,
    & > dd {
      padding-block: 8px;
      padding-inline: 12px;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    & > dt {
      border-inline-end: 1px solid ${cssVar.colorBorderSecondary};
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  content: css`
    min-width: 0;
    margin: 0;
    color: ${cssVar.colorText};
    overflow-wrap: anywhere;
  `,
  extra: css`
    flex: none;
  `,
  header: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    margin-block-end: 8px;
  `,
  label: css`
    color: ${cssVar.colorTextDescription};
    white-space: nowrap;
  `,
  list: css`
    display: grid;
    gap: 6px 12px;
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
  `,
  root: css`
    min-width: 0;
  `,
  title: css`
    font-size: 14px;
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
}));
```

`src/base-ui/Descriptions/Descriptions.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { Fragment, memo } from 'react';

import { styles } from './style';
import type { DescriptionsProps } from './type';

const Descriptions = memo<DescriptionsProps>(
  ({
    bordered = false,
    className,
    classNames,
    colon = true,
    column = 1,
    extra,
    items,
    ref,
    styles: customStyles,
    title,
    ...rest
  }) => {
    const columnCount = Math.max(1, Math.floor(column));

    return (
      <div className={cx(styles.root, className)} ref={ref} {...rest}>
        {(title != null || extra != null) && (
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            {extra != null && <div className={styles.extra}>{extra}</div>}
          </div>
        )}
        <dl
          className={cx(styles.list, bordered && styles.bordered)}
          style={{ gridTemplateColumns: `repeat(${columnCount}, auto minmax(0, 1fr))` }}
        >
          {items.map((item, index) => {
            const span = Math.min(Math.max(Math.floor(item.span ?? 1), 1), columnCount);

            return (
              <Fragment key={item.key ?? index}>
                <dt className={cx(styles.label, classNames?.label)} style={customStyles?.label}>
                  {item.label}
                  {colon && item.label != null ? ':' : null}
                </dt>
                <dd
                  className={cx(styles.content, classNames?.content)}
                  style={{
                    gridColumn: span > 1 ? `span ${span * 2 - 1}` : undefined,
                    ...customStyles?.content,
                  }}
                >
                  {item.children}
                </dd>
              </Fragment>
            );
          })}
        </dl>
      </div>
    );
  },
);

Descriptions.displayName = 'Descriptions';

export default Descriptions;
```

`src/base-ui/Descriptions/index.ts`:

```ts
export { default } from './Descriptions';
export type { DescriptionsItem, DescriptionsProps } from './type';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/Descriptions`
Expected: PASS (9 tests).

- [ ] **Step 5: Export, docs, demo**

`src/base-ui/index.ts` — insert after the `controlSize` line and before the `Divider` lines:

```ts
export { default as Descriptions } from './Descriptions';
export * from './Descriptions';
```

`src/base-ui/Descriptions/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { ActionIcon, Descriptions } from '@lobehub/ui/base-ui';
import { DownloadIcon } from 'lucide-react';

export default () => {
  return (
    <Flexbox gap={32} padding={16}>
      <Descriptions
        column={2}
        items={[
          { children: '3,482', label: 'Words' },
          { children: 'jina', label: 'Crawler' },
          { children: '18,904', label: 'Chars' },
          { children: '1–212', label: 'Lines' },
        ]}
      />
      <Descriptions
        colon={false}
        extra={<ActionIcon icon={DownloadIcon} title="Download" />}
        styles={{ label: { width: 120 } }}
        title="Basic info"
        items={[
          { children: 'quarterly-report.pdf', label: 'File name' },
          { children: '2.4 MB', label: 'Size' },
          { children: '2026-09-24 14:03', label: 'Uploaded' },
        ]}
      />
      <Descriptions
        bordered
        items={[
          { children: 'GitHub Token', label: 'Name' },
          { children: 'ghp_••••••••3kQ', label: 'Key' },
          { children: 'OAuth', label: 'Type' },
        ]}
      />
    </Flexbox>
  );
};
```

`src/base-ui/Descriptions/index.mdx`:

```mdx
---
title: Descriptions
description: Label and value pairs laid out in one or more columns, with an optional header and bordered style.
category: Data Display
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="Descriptions" from=".." />

Renders a `<dl>` laid out with CSS grid: `column` repetitions of a label track and a content track. `span` stretches an item across that many label / content pairs, clamped to `column`.

### Migrating from antd Descriptions

- `labelStyle` → `styles.label`; `classNames.label` / `classNames.content` keep working.
- `size` is removed; there is one compact density (antd `small`).
- `column` defaults to `1` (antd defaults to `3`).
- The `Descriptions.Item` children form is not supported; pass `items`.
- `layout="vertical"`, responsive `column` objects and `span: 'filled'` are not supported.
```

- [ ] **Step 6: Verify**

Run: `pnpm exec eslint src/base-ui/Descriptions src/base-ui/index.ts`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/(Descriptions|index)'`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/Descriptions src/base-ui/index.ts
git commit -m "✨ feat(base-ui): add Descriptions"
```

---

### Task 5: Steps

**Files:**

- Create: `src/base-ui/Steps/Steps.tsx`, `src/base-ui/Steps/type.ts`, `src/base-ui/Steps/style.ts`, `src/base-ui/Steps/index.ts`, `src/base-ui/Steps/index.mdx`, `src/base-ui/Steps/demos/index.tsx`
- Test: `src/base-ui/Steps/__tests__/Steps.test.tsx`
- Modify: `src/base-ui/index.ts`

**Interfaces:**

- Consumes: `Icon` default export from `@/Icon`.
- Produces: `StepStatus`, `StepItem`, `StepsProps`; default export `Steps`; each `li` carries `data-status="wait" | "process" | "finish" | "error" | "guide"`.

- [ ] **Step 1: Write the failing test**

`src/base-ui/Steps/__tests__/Steps.test.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react';

import Steps from '../Steps';

const items = [{ title: 'Select type' }, { title: 'Fill form' }, { title: 'Done' }];

const statuses = (container: HTMLElement) =>
  [...container.querySelectorAll('li')].map((li) => li.dataset.status);

describe('Steps', () => {
  afterEach(cleanup);

  test('derives statuses from current', () => {
    const { container } = render(<Steps current={1} items={items} />);

    expect(statuses(container)).toEqual(['finish', 'process', 'wait']);
  });

  test('marks the current step with aria-current', () => {
    render(<Steps current={1} items={items} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems[1].getAttribute('aria-current')).toBe('step');
    expect(listItems[0].getAttribute('aria-current')).toBeNull();
  });

  test('an item status overrides the derived one', () => {
    const { container } = render(
      <Steps current={1} items={[items[0], { ...items[1], status: 'error' }, items[2]]} />,
    );

    expect(statuses(container)).toEqual(['finish', 'error', 'wait']);
  });

  test('without current every item is a neutral guide step', () => {
    const { container } = render(<Steps items={items} />);

    expect(statuses(container)).toEqual(['guide', 'guide', 'guide']);
    expect(container.querySelector('[aria-current]')).toBeNull();
  });

  test('current past the last step marks every step finished', () => {
    const { container } = render(<Steps current={9} items={items} />);

    expect(statuses(container)).toEqual(['finish', 'finish', 'finish']);
  });

  test('shows step numbers, and no number for finished steps', () => {
    render(<Steps current={1} items={items} />);

    expect(screen.queryByText('1')).toBeNull();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  test('a custom icon replaces the number', () => {
    render(<Steps items={[{ icon: <span>ICON</span>, title: 'Create' }]} />);

    expect(screen.getByText('ICON')).toBeTruthy();
    expect(screen.queryByText('1')).toBeNull();
  });

  test('dot variant renders no numbers', () => {
    render(<Steps items={items} orientation="vertical" variant="dot" />);

    expect(screen.queryByText('1')).toBeNull();
  });

  test('renders descriptions', () => {
    render(<Steps items={[{ description: 'Pick one', title: 'Select type' }]} />);

    expect(screen.getByText('Pick one')).toBeTruthy();
  });

  test('sets the displayName', () => {
    expect(Steps.displayName).toBe('Steps');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Steps`
Expected: FAIL — cannot find `../Steps`.

- [ ] **Step 3: Implement**

`src/base-ui/Steps/type.ts`:

```ts
import type { ComponentProps, CSSProperties, Key, ReactNode, Ref } from 'react';

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

`src/base-ui/Steps/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  body: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  `,
  description: css`
    font-size: 13px;
    line-height: 1.5;
    color: ${cssVar.colorTextSecondary};
  `,
  dot: css`
    & > li > span:first-child {
      width: 7px;
      height: 7px;
      margin-block-start: 8px;
      border: 0;

      background: ${cssVar.colorTextQuaternary};
    }

    & > li[data-status='process'] > span:first-child,
    & > li[data-status='finish'] > span:first-child {
      background: ${cssVar.colorPrimary};
    }
  `,
  horizontal: css`
    display: flex;
    gap: 8px;
    align-items: center;

    & > li {
      display: flex;
      flex: 1;
      gap: 8px;
      align-items: center;

      min-width: 0;
    }

    & > li:last-child {
      flex: none;
    }
  `,
  indicator: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    width: 22px;
    height: 22px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: 50%;

    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorTextDescription};

    li[data-status='process'] > & {
      border-color: ${cssVar.colorPrimary};
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorPrimary};
    }

    li[data-status='finish'] > & {
      border-color: ${cssVar.colorPrimary};
      color: ${cssVar.colorPrimary};
    }

    li[data-status='error'] > & {
      border-color: ${cssVar.colorError};
      color: ${cssVar.colorError};
    }

    li[data-status='guide'] > & {
      color: ${cssVar.colorTextSecondary};
    }
  `,
  connector: css`
    flex: 1;
    min-width: 16px;
    height: 1px;
    background: ${cssVar.colorBorderSecondary};

    li[data-status='finish'] > & {
      background: ${cssVar.colorPrimary};
    }
  `,
  root: css`
    margin: 0;
    padding: 0;
    list-style: none;
  `,
  title: css`
    font-size: 14px;
    line-height: 22px;
    color: ${cssVar.colorTextDescription};
    white-space: nowrap;

    li[data-status='process'] &,
    li[data-status='finish'] &,
    li[data-status='guide'] & {
      color: ${cssVar.colorText};
    }

    li[data-status='process'] & {
      font-weight: 500;
    }

    li[data-status='error'] & {
      color: ${cssVar.colorError};
    }
  `,
  vertical: css`
    display: flex;
    flex-direction: column;

    & > li {
      position: relative;

      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      column-gap: 12px;

      padding-block-end: 18px;
    }

    & > li:last-child {
      padding-block-end: 0;
    }

    & > li > span[aria-hidden] {
      position: absolute;
      inset-block: 26px 4px;
      inset-inline-start: 11px;

      width: 1px;
      height: auto;
      min-width: 0;
    }

    & > li > div {
      padding-block-start: 0;
    }

    & > li > div > div:first-child {
      white-space: normal;
    }
  `,
}));
```

`src/base-ui/Steps/Steps.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { Check } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import Icon from '@/Icon';

import { styles } from './style';
import type { StepItem, StepsProps, StepStatus } from './type';

const getStatus = (index: number, current: number | undefined, item: StepItem) => {
  if (item.status) return item.status;
  if (current === undefined) return undefined;
  if (index < current) return 'finish';
  if (index === current) return 'process';
  return 'wait';
};

const renderIndicator = (
  item: StepItem,
  index: number,
  status: StepStatus | undefined,
  isDot: boolean,
): ReactNode => {
  if (isDot) return null;
  if (item.icon != null) return item.icon;
  if (status === 'finish') return <Icon icon={Check} size={12} />;
  return index + 1;
};

const Steps = memo<StepsProps>(
  ({
    className,
    classNames,
    current,
    items,
    orientation = 'horizontal',
    ref,
    styles: customStyles,
    variant = 'default',
    ...rest
  }) => {
    const isDot = variant === 'dot';

    return (
      <ol
        ref={ref}
        className={cx(
          styles.root,
          orientation === 'vertical' ? styles.vertical : styles.horizontal,
          isDot && styles.dot,
          className,
        )}
        {...rest}
      >
        {items.map((item, index) => {
          const status = getStatus(index, current, item);
          const isLast = index === items.length - 1;

          return (
            <li
              aria-current={current !== undefined && index === current ? 'step' : undefined}
              className={cx(classNames?.item)}
              data-status={status ?? 'guide'}
              key={item.key ?? index}
              style={customStyles?.item}
            >
              <span
                className={cx(styles.indicator, classNames?.indicator)}
                style={customStyles?.indicator}
              >
                {renderIndicator(item, index, status, isDot)}
              </span>
              {(item.title != null || item.description != null) && (
                <div className={styles.body}>
                  {item.title != null && (
                    <div
                      className={cx(styles.title, classNames?.title)}
                      style={customStyles?.title}
                    >
                      {item.title}
                    </div>
                  )}
                  {item.description != null && (
                    <div
                      className={cx(styles.description, classNames?.description)}
                      style={customStyles?.description}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              )}
              {!isLast && <span aria-hidden="true" className={styles.connector} />}
            </li>
          );
        })}
      </ol>
    );
  },
);

Steps.displayName = 'Steps';

export default Steps;
```

`src/base-ui/Steps/index.ts`:

```ts
export { default } from './Steps';
export type { StepItem, StepsProps, StepStatus } from './type';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/Steps`
Expected: PASS (10 tests).

- [ ] **Step 5: Export, docs, demo**

`src/base-ui/index.ts` — insert after the `Statistic` lines:

```ts
export { default as Steps } from './Steps';
export * from './Steps';
```

`src/base-ui/Steps/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { Button, Steps } from '@lobehub/ui/base-ui';
import { ChartLineIcon, PencilRulerIcon, ShieldIcon } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState(0);

  return (
    <Flexbox gap={32} padding={16}>
      <Flexbox gap={12}>
        <Steps
          current={current}
          items={[{ title: 'Select type' }, { title: 'Fill form' }, { title: 'Done' }]}
        />
        <Flexbox horizontal gap={8}>
          <Button disabled={current === 0} onClick={() => setCurrent(current - 1)}>
            Back
          </Button>
          <Button disabled={current === 2} type="primary" onClick={() => setCurrent(current + 1)}>
            Next
          </Button>
        </Flexbox>
      </Flexbox>
      <Steps
        orientation="vertical"
        items={[
          {
            description: 'Describe the assistant you want in one sentence.',
            icon: <PencilRulerIcon size={14} />,
            title: 'Create an assistant',
          },
          {
            description: 'Anonymous usage data shows which features matter most.',
            icon: <ChartLineIcon size={14} />,
            title: 'Improve the product',
          },
          {
            description: 'Turn data collection off at any time in settings.',
            icon: <ShieldIcon size={14} />,
            title: 'Stay in control',
          },
        ]}
      />
      <Steps
        orientation="vertical"
        variant="dot"
        items={[
          { title: 'Install Node.js 18 or later' },
          { title: 'Run npx @modelcontextprotocol/server' },
          { title: 'Enter the port in plugin settings' },
        ]}
      />
    </Flexbox>
  );
};
```

`src/base-ui/Steps/index.mdx`:

```mdx
---
title: Steps
description: A numbered sequence for multi-step flows, or a neutral vertical guide list when no step is current.
category: Navigation
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="Steps" from=".." />

With `current`, steps before it are `finish`, it is `process`, later ones are `wait`; an item's own `status` wins. Without `current`, every step renders as a neutral guide step. The current step gets `aria-current="step"`.

### Migrating from antd Steps

- `direction` → `orientation`; `progressDot` → `variant="dot"`; `size` is removed.
- Replace `current={null as any}` / `current={-1}` with no `current`.
- Clickable steps (`onChange`), `percent`, `labelPlacement` and `type="navigation" | "inline"` are not supported.
```

- [ ] **Step 6: Verify**

Run: `pnpm exec eslint src/base-ui/Steps src/base-ui/index.ts`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/(Steps|index)'`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/Steps src/base-ui/index.ts
git commit -m "✨ feat(base-ui): add Steps"
```

---

### Task 6: List

**Files:**

- Create: `src/base-ui/List/List.tsx`, `src/base-ui/List/ListRow.tsx`, `src/base-ui/List/type.ts`, `src/base-ui/List/style.ts`, `src/base-ui/List/index.ts`, `src/base-ui/List/index.mdx`, `src/base-ui/List/demos/index.tsx`
- Test: `src/base-ui/List/__tests__/List.test.tsx`
- Modify: `src/base-ui/index.ts`

**Interfaces:**

- Consumes: `A` from `@/A`; `Icon` + `IconProps` from `@/Icon`.
- Produces: `ListItemType`, `ListDividerType`, `ListItem` (union), `ListClickInfo`, `ListProps`; default export `List`.

- [ ] **Step 1: Write the failing test**

`src/base-ui/List/__tests__/List.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import List from '../List';
import type { ListItem } from '../type';

const items: ListItem[] = [
  { key: 'info', label: 'Assistant info' },
  { key: 'role', label: 'Role' },
  { type: 'divider' },
  { danger: true, key: 'logout', label: 'Log out' },
];

describe('List', () => {
  afterEach(cleanup);

  test('renders rows as buttons and dividers as separators', () => {
    render(<List items={items} />);

    expect(screen.getByRole('list')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByRole('separator')).toBeTruthy();
  });

  test('selectable + uncontrolled: click marks the row current and reports it', () => {
    const onActiveChange = vi.fn();
    render(<List selectable items={items} onActiveChange={onActiveChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));

    expect(screen.getByRole('button', { name: 'Role' }).getAttribute('aria-current')).toBe('true');
    expect(onActiveChange).toHaveBeenCalledWith('role');
  });

  test('not selectable: click does not mark the row current', () => {
    render(<List items={items} />);

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));

    expect(screen.getByRole('button', { name: 'Role' }).getAttribute('aria-current')).toBeNull();
  });

  test('controlled activeKey ignores clicks until the parent updates it', () => {
    render(<List selectable activeKey="info" items={items} />);

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));

    expect(
      screen.getByRole('button', { name: 'Assistant info' }).getAttribute('aria-current'),
    ).toBe('true');
    expect(screen.getByRole('button', { name: 'Role' }).getAttribute('aria-current')).toBeNull();
  });

  test('activeKey={null} renders nothing active', () => {
    const { container } = render(
      <List selectable activeKey={null} defaultActiveKey="info" items={items} />,
    );

    expect(container.querySelector('[aria-current]')).toBeNull();
  });

  test('numeric key 0 can be active', () => {
    render(
      <List
        activeKey={0}
        items={[
          { key: 0, label: 'Zero' },
          { key: 1, label: 'One' },
        ]}
      />,
    );

    expect(screen.getByRole('button', { name: 'Zero' }).getAttribute('aria-current')).toBe('true');
  });

  test('onClick receives key, item and domEvent; item onClick fires first', () => {
    const calls: string[] = [];
    const onClick = vi.fn(() => calls.push('list'));
    render(
      <List
        items={[{ key: 'a', label: 'A', onClick: () => calls.push('item') }]}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    expect(calls).toEqual(['item', 'list']);
    const info = onClick.mock.calls[0][0] as {
      key: string;
      item: { label: string };
      domEvent: unknown;
    };
    expect(info.key).toBe('a');
    expect(info.item.label).toBe('A');
    expect(info.domEvent).toBeTruthy();
  });

  test('disabled rows fire nothing and are not selected', () => {
    const onClick = vi.fn();
    render(
      <List selectable items={[{ disabled: true, key: 'd', label: 'D' }]} onClick={onClick} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'D' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'D' }).getAttribute('aria-current')).toBeNull();
  });

  test('clicks inside actions do not select the row or fire onClick', () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <List
        selectable
        onClick={onClick}
        items={[
          {
            actions: (
              <button type="button" onClick={onRemove}>
                Remove
              </button>
            ),
            key: 'm',
            label: 'Member',
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Member' }).getAttribute('aria-current')).toBeNull();
  });

  test('href rows render links with aria-current="page" when active', () => {
    render(<List activeKey="docs" items={[{ href: '/docs', key: 'docs', label: 'Docs' }]} />);

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  test('avatar wins over icon; description renders under the label', () => {
    render(
      <List
        items={[
          {
            avatar: <span>AV</span>,
            description: 'Writes long-form',
            icon: () => <svg data-testid="icon" />,
            key: 'w',
            label: 'Writer',
          },
        ]}
      />,
    );

    expect(screen.getByText('AV')).toBeTruthy();
    expect(screen.queryByTestId('icon')).toBeNull();
    expect(screen.getByText('Writes long-form')).toBeTruthy();
  });

  test('sets the displayName', () => {
    expect(List.displayName).toBe('List');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/List`
Expected: FAIL — cannot find `../List`.

- [ ] **Step 3: Implement**

`src/base-ui/List/type.ts`:

```ts
import type { ComponentProps, CSSProperties, Key, MouseEvent, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface ListClickInfo {
  domEvent: MouseEvent<HTMLElement>;
  item: ListItemType;
  key: Key;
}

export interface ListItemType {
  actions?: ReactNode;
  avatar?: ReactNode;
  className?: string;
  danger?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  href?: string;
  icon?: IconProps['icon'];
  key: Key;
  label: ReactNode;
  onClick?: (info: ListClickInfo) => void;
  showAction?: boolean;
  style?: CSSProperties;
  type?: undefined;
}

export interface ListDividerType {
  key?: Key;
  type: 'divider';
}

export type ListItem = ListItemType | ListDividerType;

export type ListSemanticName = 'actions' | 'description' | 'extra' | 'item' | 'label';

export interface ListProps extends Omit<ComponentProps<'ul'>, 'onClick'> {
  activeKey?: Key | null;
  classNames?: Partial<Record<ListSemanticName, string>>;
  compact?: boolean;
  defaultActiveKey?: Key;
  items: ListItem[];
  onActiveChange?: (key: Key) => void;
  onClick?: (info: ListClickInfo) => void;
  ref?: Ref<HTMLUListElement>;
  selectable?: boolean;
  styles?: Partial<Record<ListSemanticName, CSSProperties>>;
  variant?: 'borderless' | 'filled' | 'outlined';
}
```

`src/base-ui/List/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  actions: css`
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 8px;
    transform: translateY(-50%);

    display: none;
    gap: 4px;
    align-items: center;
  `,
  active: css`
    font-weight: 500;
    color: ${cssVar.colorText};
    background: ${cssVar.colorFillSecondary};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  body: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1px;

    min-width: 0;
  `,
  compact: css`
    gap: 2px;

    & > li > a,
    & > li > button {
      padding-inline: 8px;
    }
  `,
  danger: css`
    color: ${cssVar.colorError};

    &:hover {
      color: ${cssVar.colorError};
    }
  `,
  description: css`
    overflow: hidden;

    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    color: ${cssVar.colorTextDescription};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  disabled: css`
    cursor: not-allowed;
    opacity: 0.45;
  `,
  divider: css`
    height: 1px;
    margin-block: 4px;
    background: ${cssVar.colorBorderSecondary};
  `,
  extra: css`
    flex: none;
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  filled: css`
    padding: 4px;
    border-radius: ${cssVar.borderRadiusLG};
    background: ${cssVar.colorFillQuaternary};
  `,
  item: css`
    position: relative;

    &:hover > span:last-child,
    &:focus-within > span:last-child {
      display: inline-flex;
    }
  `,
  label: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  outlined: css`
    padding: 4px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 2px;

    margin: 0;
    padding: 0;

    list-style: none;
  `,
  row: css`
    ${focusRing};

    cursor: pointer;

    display: flex;
    gap: 12px;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    min-height: 32px;
    padding-block: 6px;
    padding-inline: 12px;
    border: 0;
    border-radius: ${cssVar.borderRadius};

    font: inherit;
    font-size: 14px;
    color: ${cssVar.colorTextSecondary};
    text-align: start;
    text-decoration: none;

    background: none;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  showAction: css`
    & > span:last-child {
      display: inline-flex;
    }
  `,
}));
```

`src/base-ui/List/ListRow.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { memo, type MouseEvent } from 'react';

import A from '@/A';
import Icon from '@/Icon';

import { styles } from './style';
import type { ListItemType, ListProps } from './type';

interface ListRowProps {
  active: boolean;
  classNames?: ListProps['classNames'];
  item: ListItemType;
  onSelect: (item: ListItemType, event: MouseEvent<HTMLElement>) => void;
  styles?: ListProps['styles'];
}

const ListRow = memo<ListRowProps>(
  ({ active, classNames, item, onSelect, styles: customStyles }) => {
    const { actions, avatar, danger, description, disabled, extra, href, icon, label, showAction } =
      item;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onSelect(item, event);
    };

    const rowClassName = cx(
      styles.row,
      active && styles.active,
      danger && styles.danger,
      disabled && styles.disabled,
      classNames?.item,
      item.className,
    );
    const rowStyle = { ...customStyles?.item, ...item.style };

    const content = (
      <>
        {avatar ?? (icon ? <Icon icon={icon} size={16} /> : null)}
        <span className={styles.body}>
          <span className={cx(styles.label, classNames?.label)} style={customStyles?.label}>
            {label}
          </span>
          {description != null && (
            <span
              className={cx(styles.description, classNames?.description)}
              style={customStyles?.description}
            >
              {description}
            </span>
          )}
        </span>
        {extra != null && (
          <span className={cx(styles.extra, classNames?.extra)} style={customStyles?.extra}>
            {extra}
          </span>
        )}
      </>
    );

    return (
      <li className={cx(styles.item, showAction && styles.showAction)}>
        {href && !disabled ? (
          <A
            aria-current={active ? 'page' : undefined}
            className={rowClassName}
            href={href}
            style={rowStyle}
            onClick={handleClick}
          >
            {content}
          </A>
        ) : (
          <button
            aria-current={active ? 'true' : undefined}
            aria-disabled={disabled || undefined}
            className={rowClassName}
            style={rowStyle}
            type="button"
            onClick={handleClick}
          >
            {content}
          </button>
        )}
        {actions != null && (
          <span className={cx(styles.actions, classNames?.actions)} style={customStyles?.actions}>
            {actions}
          </span>
        )}
      </li>
    );
  },
);

ListRow.displayName = 'ListRow';

export default ListRow;
```

`src/base-ui/List/List.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { type Key, memo, type MouseEvent, useState } from 'react';

import ListRow from './ListRow';
import { styles } from './style';
import type { ListDividerType, ListItem, ListItemType, ListProps } from './type';

const isDivider = (item: ListItem): item is ListDividerType => item.type === 'divider';

const variantClass = {
  borderless: undefined,
  filled: styles.filled,
  outlined: styles.outlined,
};

const List = memo<ListProps>(
  ({
    activeKey,
    className,
    classNames,
    compact = false,
    defaultActiveKey,
    items,
    onActiveChange,
    onClick,
    ref,
    selectable = false,
    styles: customStyles,
    variant = 'borderless',
    ...rest
  }) => {
    const [innerKey, setInnerKey] = useState<Key | undefined>(defaultActiveKey);
    const currentKey = activeKey === undefined ? innerKey : activeKey;

    const handleSelect = (item: ListItemType, domEvent: MouseEvent<HTMLElement>) => {
      const info = { domEvent, item, key: item.key };
      item.onClick?.(info);
      onClick?.(info);

      if (!selectable || item.key === currentKey) return;
      if (activeKey === undefined) setInnerKey(item.key);
      onActiveChange?.(item.key);
    };

    return (
      <ul
        className={cx(styles.root, variantClass[variant], compact && styles.compact, className)}
        ref={ref}
        role="list"
        {...rest}
      >
        {items.map((item, index) =>
          isDivider(item) ? (
            <li className={styles.divider} key={item.key ?? `divider-${index}`} role="separator" />
          ) : (
            <ListRow
              active={currentKey !== undefined && currentKey !== null && item.key === currentKey}
              classNames={classNames}
              item={item}
              key={item.key}
              styles={customStyles}
              onSelect={handleSelect}
            />
          ),
        )}
      </ul>
    );
  },
);

List.displayName = 'List';

export default List;
```

`src/base-ui/List/index.ts`:

```ts
export { default } from './List';
export type {
  ListClickInfo,
  ListDividerType,
  ListItem,
  ListItemType,
  ListProps,
  ListSemanticName,
} from './type';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/List`
Expected: PASS (12 tests).

- [ ] **Step 5: Export, docs, demo**

`src/base-ui/index.ts` — insert after `export * from './Input';`:

```ts
export { default as List } from './List';
export * from './List';
```

`src/base-ui/List/demos/index.tsx`:

```tsx
import { Flexbox } from '@lobehub/ui';
import { ActionIcon, Avatar, List } from '@lobehub/ui/base-ui';
import {
  BookOpenIcon,
  LayoutGridIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [active, setActive] = useState<string | number>('info');

  return (
    <Flexbox horizontal gap={32} padding={16} wrap="wrap">
      <Flexbox gap={8} style={{ width: 220 }}>
        <List
          selectable
          activeKey={active}
          items={[
            { icon: UserIcon, key: 'info', label: 'Assistant info' },
            { icon: PencilIcon, key: 'role', label: 'Role' },
            { icon: SettingsIcon, key: 'model', label: 'Model' },
            { icon: LayoutGridIcon, key: 'plugins', label: 'Plugins & skills' },
          ]}
          onActiveChange={setActive}
        />
      </Flexbox>
      <Flexbox style={{ width: 220 }}>
        <List
          items={[
            { extra: '⌘ ,', icon: SettingsIcon, key: 'settings', label: 'Settings' },
            { icon: BookOpenIcon, key: 'docs', label: 'Docs' },
            { type: 'divider' },
            { danger: true, icon: LogOutIcon, key: 'logout', label: 'Log out' },
          ]}
        />
      </Flexbox>
      <Flexbox style={{ width: 280 }}>
        <List
          variant="outlined"
          items={[
            {
              actions: <ActionIcon icon={XIcon} size="small" title="Remove" />,
              avatar: <Avatar avatar="✍️" size={28} />,
              description: 'Long-form writing and polishing',
              extra: 'Host',
              key: 'writer',
              label: 'Writer',
            },
            {
              actions: <ActionIcon icon={XIcon} size="small" title="Remove" />,
              avatar: <Avatar avatar="🧑‍💻" size={28} />,
              description: 'Edge cases and performance',
              key: 'reviewer',
              label: 'Code reviewer',
            },
          ]}
        />
      </Flexbox>
    </Flexbox>
  );
};
```

`src/base-ui/List/index.mdx`:

```mdx
---
title: List
description: A vertical list of selectable rows with icons or avatars, descriptions, trailing extras, hover actions and dividers.
category: Navigation
---

import DemoIndex from './demos/index.tsx?demo';

## Basic

<Demo of={DemoIndex} layout="bare" />

## APIs

<Api name="List" from=".." />

Rows render as `button`, or as lobe-ui `A` when `href` is set (router-aware through `ConfigProvider` `aAs`). With `selectable`, clicking a row makes it active; pass `activeKey` to control it (`null` for none). The active row gets `aria-current`. `actions` appear on hover or focus and never select the row. `{ type: 'divider' }` renders a separator.

### Migrating from antd Menu / List

- antd `Menu` inline navigation: `selectedKeys={[key]}` → `activeKey={key}`; drop `mode`. Item `icon` / `label` / `extra` / `danger` / `type: 'divider'` keep their shape.
- root `@lobehub/ui` `List`: `title` → `label`.
- antd `List`: map `dataSource` to `items`; `bordered` → `variant="outlined"`.
- Submenus, groups, horizontal mode and virtual scrolling are not supported.
```

- [ ] **Step 6: Verify**

Run: `pnpm exec eslint src/base-ui/List src/base-ui/index.ts`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/(List|index)'`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/List src/base-ui/index.ts
git commit -m "✨ feat(base-ui): add List"
```

---

### Task 7: Table — dependency, types, column conversion

**Files:**

- Modify: `package.json`, `pnpm-lock.yaml` (via `pnpm add`)
- Create: `src/base-ui/Table/type.ts`, `src/base-ui/Table/features.ts`, `src/base-ui/Table/toColumnDefs.ts`
- Test: `src/base-ui/Table/__tests__/toColumnDefs.test.ts`

**Interfaces:**

- Produces:
  - `tableFeatureSet` (module-scope `tableFeatures({...})` with sorting, filtering, pagination) and `type TableFeatureSet = typeof tableFeatureSet`.
  - Types `SortOrder`, `FilterValue`, `TableColumn<T>`, `TablePaginationConfig`, `TableSorterResult<T>`, `TableFilters`, `TableProps<T>`.
  - `getColumnId(column: TableColumn<any>, index: number): string`.
  - `toColumnDefs<T>(columns: TableColumn<T>[]): ColumnDef<TableFeatureSet, T, unknown>[]`.
  - `getCellValue<T>(record: T, column: TableColumn<T>): unknown`.

- [ ] **Step 1: Add the dependency**

```bash
pnpm add -w @tanstack/react-table@^9.2.4
```

Expected: `package.json` `dependencies` gains `"@tanstack/react-table": "^9.2.4"`.

- [ ] **Step 2: Write the failing test**

`src/base-ui/Table/__tests__/toColumnDefs.test.ts`:

```ts
import { getCellValue, getColumnId, toColumnDefs } from '../toColumnDefs';
import type { TableColumn } from '../type';

interface Row {
  id: string;
  name: string;
  spend: number;
}

const fakeRow = (original: Row) => ({ original }) as any;

describe('getColumnId', () => {
  test('prefers key, then dataIndex, then a positional id', () => {
    expect(getColumnId({ dataIndex: 'name', key: 'k' }, 0)).toBe('k');
    expect(getColumnId({ dataIndex: 'name' }, 0)).toBe('name');
    expect(getColumnId({ title: 'Actions' }, 3)).toBe('__column_3');
  });
});

describe('getCellValue', () => {
  test('reads dataIndex and returns undefined without it', () => {
    const record: Row = { id: '1', name: 'Ada', spend: 3 };

    expect(getCellValue(record, { dataIndex: 'name' })).toBe('Ada');
    expect(getCellValue(record, { key: 'actions' })).toBeUndefined();
  });
});

describe('toColumnDefs', () => {
  test('maps id and accessor', () => {
    const [def] = toColumnDefs<Row>([{ dataIndex: 'name', title: 'Name' }]) as any[];

    expect(def.id).toBe('name');
    expect(def.accessorFn({ id: '1', name: 'Ada', spend: 1 })).toBe('Ada');
  });

  test('wires a comparator sorter as an ascending sortFn over originals', () => {
    const [def] = toColumnDefs<Row>([
      { dataIndex: 'spend', sorter: (a, b) => a.spend - b.spend },
    ]) as any[];

    expect(def.enableSorting).toBe(true);
    expect(
      def.sortFn(
        fakeRow({ id: 'a', name: 'a', spend: 1 }),
        fakeRow({ id: 'b', name: 'b', spend: 5 }),
      ),
    ).toBeLessThan(0);
  });

  test('sorter: true enables sorting without a sortFn', () => {
    const [def] = toColumnDefs<Row>([{ dataIndex: 'spend', sorter: true }]) as any[];

    expect(def.enableSorting).toBe(true);
    expect(def.sortFn).toBeUndefined();
  });

  test('sortDirections starting with descend sets sortDescFirst', () => {
    const [def] = toColumnDefs<Row>([
      { dataIndex: 'spend', sortDirections: ['descend', 'ascend'], sorter: true },
    ]) as any[];

    expect(def.sortDescFirst).toBe(true);
  });

  test('filterFn passes when any selected value matches onFilter', () => {
    const [def] = toColumnDefs<Row>([
      {
        dataIndex: 'name',
        filters: [
          { text: 'Ada', value: 'Ada' },
          { text: 'Bob', value: 'Bob' },
        ],
        onFilter: (value, record) => record.name === value,
      },
    ]) as any[];
    const row = fakeRow({ id: '1', name: 'Bob', spend: 0 });

    expect(def.enableColumnFilter).toBe(true);
    expect(def.filterFn(row, 'name', ['Ada', 'Bob'])).toBe(true);
    expect(def.filterFn(row, 'name', ['Ada'])).toBe(false);
    expect(def.filterFn.autoRemove([])).toBe(true);
    expect(def.filterFn.autoRemove(['Ada'])).toBe(false);
  });

  test('throws for a sortable column with neither key nor dataIndex', () => {
    expect(() => toColumnDefs<Row>([{ sorter: true, title: 'x' } as TableColumn<Row>])).toThrow(
      /key.*dataIndex/,
    );
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Table/__tests__/toColumnDefs.test.ts`
Expected: FAIL — cannot find `../toColumnDefs`.

- [ ] **Step 4: Implement**

`src/base-ui/Table/type.ts`:

```ts
import type { CSSProperties, HTMLAttributes, Key, ReactNode, Ref, TdHTMLAttributes } from 'react';

export type SortOrder = 'ascend' | 'descend';

export type FilterValue = string | number | boolean;

export interface TableColumn<T> {
  align?: 'left' | 'center' | 'right';
  className?: string;
  dataIndex?: Extract<keyof T, string>;
  defaultSortOrder?: SortOrder;
  ellipsis?: boolean;
  filters?: { text: ReactNode; value: FilterValue }[];
  fixed?: 'left' | 'right';
  key?: Key;
  onCell?: (record: T, index: number) => TdHTMLAttributes<HTMLTableCellElement>;
  onFilter?: (value: FilterValue, record: T) => boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortDirections?: SortOrder[];
  sorter?: boolean | ((a: T, b: T) => number);
  title?: ReactNode;
  width?: number | string;
}

export interface TablePaginationConfig {
  current?: number;
  defaultCurrent?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  total?: number;
}

export interface TableSorterResult<T> {
  column?: TableColumn<T>;
  columnKey?: Key;
  order?: SortOrder;
}

export type TableFilters = Record<string, FilterValue[] | null>;

export type TableSemanticName = 'body' | 'cell' | 'header' | 'row' | 'wrapper';

export interface TableProps<T> {
  bordered?: boolean;
  className?: string;
  classNames?: Partial<Record<TableSemanticName, string>>;
  columns: TableColumn<T>[];
  dataSource?: T[];
  emptyText?: ReactNode;
  loading?: boolean;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: TableFilters,
    sorter: TableSorterResult<T>,
  ) => void;
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  pagination?: false | TablePaginationConfig;
  ref?: Ref<HTMLDivElement>;
  rowClassName?: string | ((record: T, index: number) => string);
  rowKey: Extract<keyof T, string> | ((record: T) => Key);
  scroll?: { x?: number | string; y?: number | string };
  size?: 'small' | 'middle';
  style?: CSSProperties;
  styles?: Partial<Record<TableSemanticName, CSSProperties>>;
  tableLayout?: 'auto' | 'fixed';
}
```

`src/base-ui/Table/features.ts`:

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

export const tableFeatureSet = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

export type TableFeatureSet = typeof tableFeatureSet;
```

`src/base-ui/Table/toColumnDefs.ts`:

```ts
import type { ColumnDef } from '@tanstack/react-table';

import type { TableFeatureSet } from './features';
import type { FilterValue, TableColumn } from './type';

export const getColumnId = (column: TableColumn<any>, index: number): string =>
  String(column.key ?? column.dataIndex ?? `__column_${index}`);

export const getCellValue = <T>(record: T, column: TableColumn<T>): unknown =>
  column.dataIndex ? record[column.dataIndex] : undefined;

const isEmptyFilter = (value: unknown) => !Array.isArray(value) || value.length === 0;

export const toColumnDefs = <T>(
  columns: TableColumn<T>[],
): ColumnDef<TableFeatureSet, T, unknown>[] =>
  columns.map((column, index) => {
    const needsStableId = Boolean(column.sorter) || Boolean(column.filters?.length);
    if (needsStableId && column.key == null && column.dataIndex == null) {
      throw new Error('[Table] sortable or filterable columns need a `key` or `dataIndex`');
    }

    const comparator = typeof column.sorter === 'function' ? column.sorter : undefined;
    const { onFilter } = column;

    const filterFn = onFilter
      ? Object.assign(
          (row: { original: T }, _columnId: string, filterValue: FilterValue[]) =>
            filterValue.some((value) => onFilter(value, row.original)),
          { autoRemove: isEmptyFilter },
        )
      : undefined;

    return {
      accessorFn: (record: T) => getCellValue(record, column),
      enableColumnFilter: Boolean(column.filters?.length),
      enableSorting: Boolean(column.sorter),
      filterFn,
      id: getColumnId(column, index),
      sortDescFirst: column.sortDirections?.[0] === 'descend',
      sortFn: comparator
        ? (rowA: { original: T }, rowB: { original: T }) => comparator(rowA.original, rowB.original)
        : undefined,
    } as unknown as ColumnDef<TableFeatureSet, T, unknown>;
  });
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/Table/__tests__/toColumnDefs.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 6: Verify types**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/Table'`
Expected: no output. If `tableFeatures` / `createFilteredRowModel` / `createSortedRowModel` / `createPaginatedRowModel` report a signature mismatch, open `node_modules/@tanstack/table-core/dist/features/<feature>/create*RowModel.d.ts` and match the documented call shape; do not switch to v8 names.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/base-ui/Table/type.ts src/base-ui/Table/features.ts src/base-ui/Table/toColumnDefs.ts src/base-ui/Table/__tests__/toColumnDefs.test.ts
git commit -m "✨ feat(base-ui): add Table column model on TanStack Table v9"
```

---

### Task 8: Table — rendering, sorting, pagination, rows, loading, scroll

**Files:**

- Create: `src/base-ui/Table/Table.tsx`, `src/base-ui/Table/TableHead.tsx`, `src/base-ui/Table/TableBody.tsx`, `src/base-ui/Table/fixedOffsets.ts`, `src/base-ui/Table/useTableState.ts`, `src/base-ui/Table/style.ts`, `src/base-ui/Table/index.ts`
- Test: `src/base-ui/Table/__tests__/Table.test.tsx`
- Modify: `src/base-ui/index.ts`

**Interfaces:**

- Consumes: `tableFeatureSet`, `toColumnDefs`, `getColumnId`, `getCellValue`, all Table types (Task 7); `Pagination` from `@/base-ui/Pagination` (`current`, `pageSize`, `total`, `showSizeChanger`, `pageSizeOptions`, `onChange(page, pageSize)`, `onPageSizeChange(current, size)`); `Spin` from `@/base-ui/Spin`; `Empty` from `@/Empty`.
- Produces: default export `Table` (generic `<T>(props: TableProps<T>) => ReactNode`); `getFixedOffsets(columns): (CSSProperties | undefined)[]`; `TableHead` props `{ columns, columnIds, fixedOffsets, getColumn(id), classNames?, styles?, renderFilter?(column, id) }`; `TableInner` accepts an internal `renderFilter?(column, id, table)` override. Task 9 plugs the default `FilterMenu` into `renderFilter`.

- [ ] **Step 1: Write the failing test**

`src/base-ui/Table/__tests__/Table.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import Table from '../Table';
import type { TableColumn } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  id: string;
  model: string;
  provider: string;
  spend: number;
}

const rows: Row[] = [
  { id: '1', model: 'gpt-5', provider: 'OpenAI', spend: 30 },
  { id: '2', model: 'claude-sonnet-5', provider: 'Anthropic', spend: 10 },
  { id: '3', model: 'gemini-3-pro', provider: 'Google', spend: 20 },
];

const columns: TableColumn<Row>[] = [
  { dataIndex: 'model', sorter: (a, b) => a.model.localeCompare(b.model), title: 'Model' },
  { dataIndex: 'provider', title: 'Provider' },
  { align: 'right', dataIndex: 'spend', sorter: (a, b) => a.spend - b.spend, title: 'Spend' },
];

const bodyModels = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

const manyRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index),
    model: `m-${String(index).padStart(2, '0')}`,
    provider: 'P',
    spend: index,
  }));

describe('Table', () => {
  afterEach(cleanup);

  test('renders headers and rows', () => {
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />);

    expect(screen.getByRole('columnheader', { name: /Model/ })).toBeTruthy();
    expect(bodyModels()).toEqual(['gpt-5', 'claude-sonnet-5', 'gemini-3-pro']);
  });

  test('rowKey accepts a function', () => {
    const rowKey = vi.fn((row: Row) => row.id);
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey={rowKey} />);

    expect(rowKey).toHaveBeenCalled();
  });

  test('render receives value, record and index', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        rowKey="id"
        columns={[
          {
            dataIndex: 'spend',
            render: (value, record, index) => `${record.model}:${value}:${index}`,
            title: 'X',
          },
        ]}
      />,
    );

    expect(screen.getByText('gpt-5:30:0')).toBeTruthy();
    expect(screen.getByText('gemini-3-pro:20:2')).toBeTruthy();
  });

  test('header click cycles ascend → descend → none and follows aria-sort', () => {
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />);
    const header = screen.getByRole('columnheader', { name: /Spend/ });
    const button = within(header).getByRole('button');

    expect(header.getAttribute('aria-sort')).toBe('none');

    fireEvent.click(button);
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(bodyModels()).toEqual(['claude-sonnet-5', 'gemini-3-pro', 'gpt-5']);

    fireEvent.click(button);
    expect(header.getAttribute('aria-sort')).toBe('descending');
    expect(bodyModels()).toEqual(['gpt-5', 'gemini-3-pro', 'claude-sonnet-5']);

    fireEvent.click(button);
    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(bodyModels()).toEqual(['gpt-5', 'claude-sonnet-5', 'gemini-3-pro']);
  });

  test('defaultSortOrder seeds the sort', () => {
    render(
      <Table
        columns={[{ ...columns[2], defaultSortOrder: 'descend' }]}
        dataSource={rows}
        pagination={false}
        rowKey="id"
      />,
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual(['30', '20', '10']);
  });

  test('sorter: true keeps row order and reports the sort through onChange', () => {
    const onChange = vi.fn();
    render(
      <Table
        columns={[{ dataIndex: 'spend', key: 'spend', sorter: true, title: 'Spend' }]}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        onChange={onChange}
      />,
    );

    fireEvent.click(
      within(screen.getByRole('columnheader', { name: /Spend/ })).getByRole('button'),
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual(['30', '10', '20']);
    const sorter = onChange.mock.calls.at(-1)![2];
    expect(sorter).toMatchObject({ columnKey: 'spend', order: 'ascend' });
  });

  test('paginates locally with the default page size of 10', () => {
    render(<Table columns={columns} dataSource={manyRows(12)} rowKey="id" />);

    expect(screen.getAllByRole('row')).toHaveLength(11);
  });

  test('defaultCurrent and pageSize select the page', () => {
    render(
      <Table
        columns={columns}
        dataSource={manyRows(12)}
        pagination={{ defaultCurrent: 2, pageSize: 5 }}
        rowKey="id"
      />,
    );

    expect(bodyModels()).toEqual(['m-05', 'm-06', 'm-07', 'm-08', 'm-09']);
  });

  test('sorting resets to page 1', () => {
    render(
      <Table
        columns={columns}
        dataSource={manyRows(12)}
        pagination={{ defaultCurrent: 2, pageSize: 5 }}
        rowKey="id"
      />,
    );

    const spend = screen.getByRole('columnheader', { name: /Spend/ });
    fireEvent.click(within(spend).getByRole('button'));
    fireEvent.click(within(spend).getByRole('button'));

    expect(bodyModels()[0]).toBe('m-11');
  });

  test('shrinking dataSource clamps the page to the last existing page', () => {
    const { rerender } = render(
      <Table
        columns={columns}
        dataSource={manyRows(12)}
        pagination={{ defaultCurrent: 3, pageSize: 5 }}
        rowKey="id"
      />,
    );
    expect(bodyModels()).toEqual(['m-10', 'm-11']);

    rerender(
      <Table
        columns={columns}
        dataSource={manyRows(8)}
        pagination={{ defaultCurrent: 3, pageSize: 5 }}
        rowKey="id"
      />,
    );

    expect(bodyModels()).toEqual(['m-05', 'm-06', 'm-07']);
  });

  test('pagination.total switches to server pagination and keeps rows as given', () => {
    render(
      <Table
        columns={columns}
        dataSource={manyRows(5)}
        pagination={{ current: 3, pageSize: 5, total: 40 }}
        rowKey="id"
      />,
    );

    expect(bodyModels()).toEqual(['m-00', 'm-01', 'm-02', 'm-03', 'm-04']);
  });

  test('pagination={false} renders every row and no pager', () => {
    render(<Table columns={columns} dataSource={manyRows(15)} pagination={false} rowKey="id" />);

    expect(screen.getAllByRole('row')).toHaveLength(16);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  test('onRow click fires and rowClassName applies', () => {
    const onClick = vi.fn();
    render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowClassName={(record) => `row-${record.id}`}
        rowKey="id"
        onRow={(record) => ({ onClick: () => onClick(record.id) })}
      />,
    );

    const firstRow = screen.getAllByRole('row')[1];
    fireEvent.click(firstRow);

    expect(onClick).toHaveBeenCalledWith('1');
    expect(firstRow.className).toContain('row-1');
  });

  test('loading keeps rows and shows the overlay', () => {
    const { container } = render(
      <Table loading columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );

    expect(bodyModels()).toHaveLength(3);
    expect(container.querySelector('[data-table-loading]')).toBeTruthy();
  });

  test('empty data shows emptyText', () => {
    render(<Table columns={columns} dataSource={[]} emptyText="Nothing here" rowKey="id" />);

    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  test('scroll.y limits the wrapper height', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ y: 200 }}
      />,
    );

    expect(container.querySelector('[data-table-wrapper]')!.getAttribute('style')).toContain(
      'max-height: 200px',
    );
  });

  test('fixed right columns are sticky at the right edge', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        rowKey="id"
        columns={[
          ...columns,
          { fixed: 'right', key: 'action', render: () => 'Open', title: 'Action', width: 80 },
        ]}
      />,
    );

    const cell = screen.getAllByText('Open')[0].closest('td')!;
    expect(cell.getAttribute('style')).toContain('position: sticky');
    expect(cell.getAttribute('style')).toContain('right: 0px');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Table/__tests__/Table.test.tsx`
Expected: FAIL — cannot find `../Table`.

- [ ] **Step 3: Implement**

`src/base-ui/Table/fixedOffsets.ts`:

```ts
import type { CSSProperties } from 'react';

import type { TableColumn } from './type';

const widthOf = (column: TableColumn<any>) => (typeof column.width === 'number' ? column.width : 0);

export const getFixedOffsets = (columns: TableColumn<any>[]): (CSSProperties | undefined)[] => {
  const offsets: (CSSProperties | undefined)[] = columns.map(() => undefined);

  let left = 0;
  columns.forEach((column, index) => {
    if (column.fixed !== 'left') return;
    offsets[index] = { left, position: 'sticky' };
    left += widthOf(column);
  });

  let right = 0;
  for (let index = columns.length - 1; index >= 0; index--) {
    const column = columns[index];
    if (column.fixed !== 'right') continue;
    offsets[index] = { position: 'sticky', right };
    right += widthOf(column);
  }

  return offsets;
};
```

`src/base-ui/Table/useTableState.ts`:

```ts
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table';
import { useState } from 'react';

import { getColumnId } from './toColumnDefs';
import type {
  TableColumn,
  TableFilters,
  TablePaginationConfig,
  TableProps,
  TableSorterResult,
} from './type';

const resolve = <S>(updater: Updater<S>, previous: S): S =>
  typeof updater === 'function' ? (updater as (old: S) => S)(previous) : updater;

const initialSorting = (columns: TableColumn<any>[]): SortingState => {
  const index = columns.findIndex((column) => column.defaultSortOrder);
  if (index === -1) return [];
  return [
    { desc: columns[index].defaultSortOrder === 'descend', id: getColumnId(columns[index], index) },
  ];
};

export const useTableState = <T>({
  columns,
  onChange,
  pagination,
}: Pick<TableProps<T>, 'columns' | 'onChange' | 'pagination'>) => {
  const config: TablePaginationConfig | undefined =
    pagination === false ? undefined : (pagination ?? {});
  const columnIds = columns.map((column, index) => getColumnId(column, index));

  const [sorting, setSorting] = useState<SortingState>(() => initialSorting(columns));
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [innerPage, setInnerPage] = useState<PaginationState>({
    pageIndex: (config?.defaultCurrent ?? 1) - 1,
    pageSize: config?.defaultPageSize ?? 10,
  });

  const page: PaginationState = {
    pageIndex: config?.current === undefined ? innerPage.pageIndex : config.current - 1,
    pageSize: config?.pageSize ?? innerPage.pageSize,
  };

  const toFilters = (state: ColumnFiltersState): TableFilters =>
    Object.fromEntries(
      columns
        .map((column, index) => [column, columnIds[index]] as const)
        .filter(([column]) => column.filters?.length)
        .map(([, id]) => [
          id,
          (state.find((filter) => filter.id === id)?.value as TableFilters[string]) ?? null,
        ]),
    );

  const toSorter = (state: SortingState): TableSorterResult<T> => {
    const [active] = state;
    if (!active) return {};
    const index = columnIds.indexOf(active.id);
    return {
      column: columns[index],
      columnKey: active.id,
      order: active.desc ? 'descend' : 'ascend',
    };
  };

  const toPaginationArg = (next: PaginationState): TablePaginationConfig =>
    config ? { ...config, current: next.pageIndex + 1, pageSize: next.pageSize } : {};

  const report = (
    nextPage: PaginationState,
    nextFilters: ColumnFiltersState,
    nextSorting: SortingState,
  ) => onChange?.(toPaginationArg(nextPage), toFilters(nextFilters), toSorter(nextSorting));

  const changePage = (next: PaginationState) => {
    setInnerPage(next);
    if (next.pageIndex !== page.pageIndex) config?.onChange?.(next.pageIndex + 1, next.pageSize);
    if (next.pageSize !== page.pageSize) {
      config?.onShowSizeChange?.(next.pageIndex + 1, next.pageSize);
      config?.onChange?.(next.pageIndex + 1, next.pageSize);
    }
  };

  const onSortingChange = (updater: Updater<SortingState>) => {
    const next = resolve(updater, sorting);
    const firstPage = { ...page, pageIndex: 0 };
    setSorting(next);
    changePage(firstPage);
    report(firstPage, columnFilters, next);
  };

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const next = resolve(updater, columnFilters);
    const firstPage = { ...page, pageIndex: 0 };
    setColumnFilters(next);
    changePage(firstPage);
    report(firstPage, next, sorting);
  };

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const next = resolve(updater, page);
    changePage(next);
    report(next, columnFilters, sorting);
  };

  return {
    columnFilters,
    columnIds,
    config,
    manualPagination: pagination === false || config?.total !== undefined,
    manualSorting: columns.some((column) => column.sorter === true),
    onColumnFiltersChange,
    onPaginationChange,
    onSortingChange,
    page,
    setInnerPage,
    sorting,
  };
};
```

`src/base-ui/Table/style.ts`:

```ts
import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bordered: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    & th,
    & td {
      border-inline-end: 1px solid ${cssVar.colorBorderSecondary};
    }

    & th:last-child,
    & td:last-child {
      border-inline-end: 0;
    }
  `,
  cell: css`
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
    font-variant-numeric: tabular-nums;
    background: ${cssVar.colorBgContainer};
  `,
  clickable: css`
    cursor: pointer;
  `,
  ellipsis: css`
    overflow: hidden;
    max-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  empty: css`
    padding-block: 32px;
    color: ${cssVar.colorTextDescription};
    text-align: center;
  `,
  fixed: css`
    z-index: 1;
    background: ${cssVar.colorBgContainer};
  `,
  header: css`
    position: sticky;
    z-index: 2;
    inset-block-start: 0;

    font-size: 13px;
    font-weight: 500;
    color: ${cssVar.colorTextSecondary};
    text-align: start;
    white-space: nowrap;

    background: ${cssVar.colorBgContainer};
    box-shadow:
      inset 0 -1px 0 ${cssVar.colorBorderSecondary},
      inset 0 999px 0 ${cssVar.colorFillQuaternary};
  `,
  headerInner: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;
  `,
  loading: css`
    position: absolute;
    z-index: 3;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 60%, transparent);
  `,
  middle: css`
    & th,
    & td {
      padding-block: 12px;
      padding-inline: 16px;
    }
  `,
  pagination: css`
    display: flex;
    justify-content: flex-end;
    margin-block-start: 12px;
  `,
  root: css`
    min-width: 0;
  `,
  row: css`
    &:hover > td {
      background: color-mix(in srgb, ${cssVar.colorBgContainer}, ${cssVar.colorText} 3%);
    }

    &:last-child > td {
      border-block-end: 0;
    }
  `,
  small: css`
    & th,
    & td {
      padding-block: 8px;
      padding-inline: 12px;
    }
  `,
  sortButton: css`
    ${focusRing};

    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;

    padding: 0;
    border: 0;
    border-radius: 4px;

    font: inherit;
    color: inherit;

    background: none;
  `,
  sortCaret: css`
    display: inline-flex;
    flex-direction: column;
    color: ${cssVar.colorTextQuaternary};

    & > [data-active='true'] {
      color: ${cssVar.colorText};
    }
  `,
  table: css`
    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    font-size: 14px;
  `,
  wrapper: css`
    position: relative;
    overflow: auto;
  `,
}));
```

`src/base-ui/Table/TableHead.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import Icon from '@/Icon';

import { styles } from './style';
import type { TableColumn, TableProps } from './type';

type SortState = false | 'asc' | 'desc';

interface HeadColumn {
  getIsSorted: () => SortState;
  getToggleSortingHandler: () => undefined | ((event: unknown) => void);
}

interface TableHeadProps<T> {
  classNames?: TableProps<T>['classNames'];
  columnIds: string[];
  columns: TableColumn<T>[];
  fixedOffsets: (CSSProperties | undefined)[];
  getColumn: (id: string) => HeadColumn | undefined;
  renderFilter?: (column: TableColumn<T>, id: string) => ReactNode;
  styles?: TableProps<T>['styles'];
}

const ariaSortOf = (sorted: SortState) =>
  sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none';

const TableHead = <T,>({
  classNames,
  columnIds,
  columns,
  fixedOffsets,
  getColumn,
  renderFilter,
  styles: customStyles,
}: TableHeadProps<T>) => (
  <thead>
    <tr>
      {columns.map((column, index) => {
        const id = columnIds[index];
        const tableColumn = getColumn(id);
        const sorted: SortState = column.sorter ? (tableColumn?.getIsSorted() ?? false) : false;

        return (
          <th
            aria-sort={column.sorter ? ariaSortOf(sorted) : undefined}
            key={id}
            scope="col"
            className={cx(
              styles.header,
              column.fixed && styles.fixed,
              column.className,
              classNames?.header,
            )}
            style={{
              textAlign: column.align,
              width: column.width,
              ...fixedOffsets[index],
              ...customStyles?.header,
              ...(column.fixed ? { zIndex: 3 } : undefined),
            }}
          >
            <span className={styles.headerInner}>
              {column.sorter ? (
                <button
                  className={styles.sortButton}
                  type="button"
                  onClick={tableColumn?.getToggleSortingHandler()}
                >
                  {column.title}
                  <span aria-hidden="true" className={styles.sortCaret}>
                    <Icon data-active={sorted === 'asc'} icon={ChevronUp} size={10} />
                    <Icon data-active={sorted === 'desc'} icon={ChevronDown} size={10} />
                  </span>
                </button>
              ) : (
                column.title
              )}
              {column.filters?.length ? renderFilter?.(column, id) : null}
            </span>
          </th>
        );
      })}
    </tr>
  </thead>
);

export default TableHead;
```

`src/base-ui/Table/TableBody.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import type { CSSProperties, Key, ReactNode } from 'react';

import Spin from '@/base-ui/Spin';
import Empty from '@/Empty';

import { styles } from './style';
import { getCellValue } from './toColumnDefs';
import type { TableColumn, TableProps } from './type';

interface TableBodyProps<T> {
  classNames?: TableProps<T>['classNames'];
  columnIds: string[];
  columns: TableColumn<T>[];
  emptyText?: ReactNode;
  fixedOffsets: (CSSProperties | undefined)[];
  loading: boolean;
  onRow?: TableProps<T>['onRow'];
  rowClassName?: TableProps<T>['rowClassName'];
  rows: { id: Key; original: T }[];
  styles?: TableProps<T>['styles'];
}

const TableBody = <T,>({
  classNames,
  columnIds,
  columns,
  emptyText,
  fixedOffsets,
  loading,
  onRow,
  rowClassName,
  rows,
  styles: customStyles,
}: TableBodyProps<T>) => {
  if (rows.length === 0) {
    return (
      <tbody className={classNames?.body} style={customStyles?.body}>
        <tr>
          <td className={styles.empty} colSpan={columns.length}>
            {loading ? <Spin /> : (emptyText ?? <Empty description="No data" />)}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={classNames?.body} style={customStyles?.body}>
      {rows.map((row, rowIndex) => {
        const record = row.original;
        const rowProps = onRow?.(record, rowIndex) ?? {};
        const extraClassName =
          typeof rowClassName === 'function' ? rowClassName(record, rowIndex) : rowClassName;

        return (
          <tr
            {...rowProps}
            key={row.id}
            className={cx(
              styles.row,
              rowProps.onClick && styles.clickable,
              extraClassName,
              classNames?.row,
              rowProps.className,
            )}
            style={{ ...customStyles?.row, ...rowProps.style }}
          >
            {columns.map((column, columnIndex) => {
              const value = getCellValue(record, column);
              const cellProps = column.onCell?.(record, rowIndex) ?? {};
              const content = column.render
                ? column.render(value, record, rowIndex)
                : (value as ReactNode);

              return (
                <td
                  {...cellProps}
                  key={columnIds[columnIndex]}
                  title={column.ellipsis && typeof content === 'string' ? content : cellProps.title}
                  className={cx(
                    styles.cell,
                    column.ellipsis && styles.ellipsis,
                    column.fixed && styles.fixed,
                    column.className,
                    classNames?.cell,
                    cellProps.className,
                  )}
                  style={{
                    textAlign: column.align,
                    width: column.width,
                    ...fixedOffsets[columnIndex],
                    ...customStyles?.cell,
                    ...cellProps.style,
                  }}
                >
                  {content}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
```

`src/base-ui/Table/Table.tsx`:

```tsx
'use client';

import { useTable } from '@tanstack/react-table';
import { cx } from 'antd-style';
import { type Key, memo, type ReactNode, useEffect, useMemo } from 'react';

import Pagination from '@/base-ui/Pagination';
import Spin from '@/base-ui/Spin';

import { tableFeatureSet } from './features';
import { getFixedOffsets } from './fixedOffsets';
import { styles } from './style';
import TableBody from './TableBody';
import TableHead from './TableHead';
import { toColumnDefs } from './toColumnDefs';
import type { TableColumn, TableProps } from './type';
import { useTableState } from './useTableState';

const EMPTY_DATA: any[] = [];

export interface TableInternalProps<T> extends TableProps<T> {
  renderFilter?: (column: TableColumn<T>, id: string, table: any) => ReactNode;
}

const TableInner = <T,>(props: TableInternalProps<T>) => {
  const {
    bordered = false,
    className,
    classNames,
    columns,
    dataSource = EMPTY_DATA as T[],
    emptyText,
    loading = false,
    onChange,
    onRow,
    pagination,
    ref,
    renderFilter,
    rowClassName,
    rowKey,
    scroll,
    size = 'middle',
    style,
    styles: customStyles,
    tableLayout,
  } = props;

  const state = useTableState({ columns, onChange, pagination });
  const columnDefs = useMemo(() => toColumnDefs(columns), [columns]);
  const fixedOffsets = useMemo(() => getFixedOffsets(columns), [columns]);

  const table = useTable({
    autoResetPageIndex: false,
    columns: columnDefs,
    data: dataSource,
    enableSortingRemoval: true,
    features: tableFeatureSet,
    getRowId: (record: T) =>
      String(typeof rowKey === 'function' ? rowKey(record) : (record[rowKey] as Key)),
    manualPagination: state.manualPagination,
    manualSorting: state.manualSorting,
    onColumnFiltersChange: state.onColumnFiltersChange,
    onPaginationChange: state.onPaginationChange,
    onSortingChange: state.onSortingChange,
    rowCount: state.config?.total,
    state: {
      columnFilters: state.columnFilters,
      pagination: state.page,
      sorting: state.sorting,
    },
  } as any);

  const total = state.config?.total ?? table.getPrePaginatedRowModel().rows.length;
  const pageCount = Math.max(1, Math.ceil(total / state.page.pageSize));
  const { page, setInnerPage } = state;

  useEffect(() => {
    if (pagination === false || state.config?.total !== undefined) return;
    if (page.pageIndex >= pageCount) setInnerPage({ ...page, pageIndex: pageCount - 1 });
  }, [pageCount, page, pagination, setInnerPage, state.config?.total]);

  const rows = table.getRowModel().rows as unknown as { id: Key; original: T }[];
  const minWidth = scroll?.x === 'max-content' ? undefined : scroll?.x;

  return (
    <div className={cx(styles.root, className)} ref={ref} style={style}>
      <div
        data-table-wrapper=""
        className={cx(styles.wrapper, bordered && styles.bordered, classNames?.wrapper)}
        style={{ maxHeight: scroll?.y, ...customStyles?.wrapper }}
      >
        <table
          className={cx(styles.table, size === 'small' ? styles.small : styles.middle)}
          style={{
            minWidth,
            tableLayout,
            width: scroll?.x === 'max-content' ? 'max-content' : '100%',
          }}
        >
          <TableHead
            classNames={classNames}
            columnIds={state.columnIds}
            columns={columns}
            fixedOffsets={fixedOffsets}
            getColumn={(id) => table.getColumn(id) as any}
            renderFilter={
              renderFilter ? (column, id) => renderFilter(column, id, table) : undefined
            }
            styles={customStyles}
          />
          <TableBody
            classNames={classNames}
            columnIds={state.columnIds}
            columns={columns}
            emptyText={emptyText}
            fixedOffsets={fixedOffsets}
            loading={loading}
            rowClassName={rowClassName}
            rows={rows}
            styles={customStyles}
            onRow={onRow}
          />
        </table>
        {loading && rows.length > 0 && (
          <div className={styles.loading} data-table-loading="">
            <Spin />
          </div>
        )}
      </div>
      {pagination !== false && total > 0 && (
        <div className={styles.pagination}>
          <Pagination
            current={Math.min(page.pageIndex, pageCount - 1) + 1}
            pageSize={page.pageSize}
            pageSizeOptions={state.config?.pageSizeOptions}
            showSizeChanger={state.config?.showSizeChanger}
            total={total}
            onChange={(next, pageSize) =>
              state.onPaginationChange({ pageIndex: next - 1, pageSize })
            }
            onPageSizeChange={(current, pageSize) =>
              state.onPaginationChange({ pageIndex: current - 1, pageSize })
            }
          />
        </div>
      )}
    </div>
  );
};

const Table = memo(TableInner) as unknown as (<T>(props: TableProps<T>) => ReactNode) & {
  displayName?: string;
};

Table.displayName = 'Table';

export { TableInner };

export default Table;
```

`src/base-ui/Table/index.ts`:

```ts
export { default } from './Table';
export type {
  FilterValue,
  SortOrder,
  TableColumn,
  TableFilters,
  TablePaginationConfig,
  TableProps,
  TableSemanticName,
  TableSorterResult,
} from './type';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/base-ui/Table`
Expected: PASS (toColumnDefs 8 + Table 17). If the header `button` name assertions fail because the carets add text, check that the caret `Icon`s render only SVGs (no text nodes).

- [ ] **Step 5: Export**

`src/base-ui/index.ts` — insert after the `Switch` lines and before `Tabs`:

```ts
export { default as Table } from './Table';
export * from './Table';
```

- [ ] **Step 6: Verify**

Run: `pnpm exec eslint src/base-ui/Table src/base-ui/index.ts`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/(Table|index)'`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/Table src/base-ui/index.ts
git commit -m "✨ feat(base-ui): add Table with sorting, pagination and sticky layout"
```

---

### Task 9: Table — header filters, docs, demos

**Files:**

- Create: `src/base-ui/Table/FilterMenu.tsx`, `src/base-ui/Table/index.mdx`, `src/base-ui/Table/demos/index.tsx`, `src/base-ui/Table/demos/server.tsx`
- Modify: `src/base-ui/Table/Table.tsx` (wire `FilterMenu` by default), `src/base-ui/Table/style.ts` (filter button styles)
- Test: `src/base-ui/Table/__tests__/TableFilter.test.tsx`

**Interfaces:**

- Consumes: `DropdownMenu` default export from `@/base-ui/DropdownMenu` (`items`, trigger as `children`; checkbox items `{ type: 'checkbox', key, label, checked, closeOnClick, onCheckedChange }`); TanStack column methods `getFilterValue()` / `setFilterValue(value)` (called on the column instance).
- Produces: `FilterMenu` props `{ filters: TableColumn<any>['filters']; value: FilterValue[]; onChange: (next: FilterValue[]) => void }`.

- [ ] **Step 1: Write the failing test**

`src/base-ui/Table/__tests__/TableFilter.test.tsx`:

```tsx
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import Table from '../Table';
import type { TableColumn } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  id: string;
  model: string;
  provider: string;
}

const rows: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index),
  model: `m-${String(index).padStart(2, '0')}`,
  provider: index % 3 === 0 ? 'OpenAI' : 'Other',
}));

const columns: TableColumn<Row>[] = [
  { dataIndex: 'model', title: 'Model' },
  {
    dataIndex: 'provider',
    filters: [
      { text: 'OpenAI', value: 'OpenAI' },
      { text: 'Other', value: 'Other' },
    ],
    onFilter: (value, record) => record.provider === value,
    title: 'Provider',
  },
];

const bodyModels = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('Table filters', () => {
  afterEach(cleanup);

  test('toggling a filter item filters rows and reports through onChange', () => {
    const onChange = vi.fn();
    render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'OpenAI' }));

    expect(bodyModels()).toEqual(['m-00', 'm-03', 'm-06', 'm-09']);
    expect(onChange.mock.calls.at(-1)![1]).toEqual({ provider: ['OpenAI'] });
  });

  test('reset clears the filter', () => {
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />);

    fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'OpenAI' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reset' }));

    expect(bodyModels()).toHaveLength(12);
  });

  test('filtering from a later page returns to page 1', () => {
    render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={{ defaultCurrent: 3, pageSize: 5 }}
        rowKey="id"
      />,
    );
    expect(bodyModels()).toEqual(['m-10', 'm-11']);

    fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'OpenAI' }));

    expect(bodyModels()).toEqual(['m-00', 'm-03', 'm-06', 'm-09']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/base-ui/Table/__tests__/TableFilter.test.tsx`
Expected: FAIL — no button named `Filter Provider`.

- [ ] **Step 3: Implement**

Append to the object in `src/base-ui/Table/style.ts`:

```ts
  filterActive: css`
    color: ${cssVar.colorPrimary};
  `,
  filterButton: css`
    ${focusRing};

    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 2px;
    border: 0;
    border-radius: 4px;

    color: ${cssVar.colorTextQuaternary};

    background: none;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
```

`src/base-ui/Table/FilterMenu.tsx`:

```tsx
'use client';

import { cx } from 'antd-style';
import { ListFilter } from 'lucide-react';
import { memo, type ReactNode } from 'react';

import DropdownMenu from '@/base-ui/DropdownMenu';
import type { DropdownItem } from '@/base-ui/DropdownMenu/type';
import Icon from '@/Icon';

import { styles } from './style';
import type { FilterValue } from './type';

interface FilterMenuProps {
  filters: { text: ReactNode; value: FilterValue }[];
  label: string;
  onChange: (next: FilterValue[]) => void;
  value: FilterValue[];
}

const FilterMenu = memo<FilterMenuProps>(({ filters, label, onChange, value }) => {
  const items: DropdownItem[] = [
    ...filters.map((filter) => ({
      checked: value.includes(filter.value),
      closeOnClick: false,
      key: String(filter.value),
      label: filter.text,
      onCheckedChange: (checked: boolean) =>
        onChange(
          checked ? [...value, filter.value] : value.filter((item) => item !== filter.value),
        ),
      type: 'checkbox' as const,
    })),
    { type: 'divider' as const },
    { disabled: value.length === 0, key: '__reset', label: 'Reset', onClick: () => onChange([]) },
  ];

  return (
    <DropdownMenu items={items}>
      <button
        aria-label={`Filter ${label}`}
        className={cx(styles.filterButton, value.length > 0 && styles.filterActive)}
        type="button"
      >
        <Icon icon={ListFilter} size={12} />
      </button>
    </DropdownMenu>
  );
});

FilterMenu.displayName = 'TableFilterMenu';

export default FilterMenu;
```

In `src/base-ui/Table/Table.tsx`:

1. Add the import: `import FilterMenu from './FilterMenu';`
2. Replace the `renderFilter` prop passed to `TableHead` with a default that uses `FilterMenu` when no override is given:

```tsx
            renderFilter={(column, id) => {
              if (renderFilter) return renderFilter(column, id, table);
              const tableColumn = table.getColumn(id) as any;
              const value = (tableColumn?.getFilterValue() as FilterValue[] | undefined) ?? [];
              return (
                <FilterMenu
                  filters={column.filters ?? []}
                  label={typeof column.title === 'string' ? column.title : id}
                  value={value}
                  onChange={(next) => tableColumn?.setFilterValue(next.length > 0 ? next : undefined)}
                />
              );
            }}
```

3. Add `FilterValue` to the type import: `import type { FilterValue, TableColumn, TableProps } from './type';`

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm vitest run src/base-ui/Table`
Expected: PASS (toColumnDefs 8 + Table 17 + filters 3).

- [ ] **Step 5: Docs and demos**

`src/base-ui/Table/demos/index.tsx`:

```tsx
import { Table, type TableColumn } from '@lobehub/ui/base-ui';

interface UsageRow {
  calls: number;
  id: string;
  model: string;
  provider: string;
  spend: number;
}

const data: UsageRow[] = [
  { calls: 18420, id: '1', model: 'gpt-5', provider: 'OpenAI', spend: 312.4 },
  { calls: 60210, id: '2', model: 'gpt-5-mini', provider: 'OpenAI', spend: 64.9 },
  { calls: 22105, id: '3', model: 'claude-sonnet-5', provider: 'Anthropic', spend: 287.1 },
  { calls: 41870, id: '4', model: 'claude-haiku-4-5', provider: 'Anthropic', spend: 38.2 },
  { calls: 9310, id: '5', model: 'gemini-3-pro', provider: 'Google', spend: 141.7 },
  { calls: 35620, id: '6', model: 'gemini-3-flash', provider: 'Google', spend: 22.6 },
  { calls: 27540, id: '7', model: 'deepseek-v4', provider: 'DeepSeek', spend: 31.5 },
  { calls: 12090, id: '8', model: 'qwen3-max', provider: 'Qwen', spend: 26.8 },
];

const providers = [...new Set(data.map((row) => row.provider))];

const columns: TableColumn<UsageRow>[] = [
  { dataIndex: 'model', sorter: (a, b) => a.model.localeCompare(b.model), title: 'Model' },
  {
    dataIndex: 'provider',
    filters: providers.map((provider) => ({ text: provider, value: provider })),
    onFilter: (value, record) => record.provider === value,
    title: 'Provider',
  },
  {
    align: 'right',
    dataIndex: 'calls',
    render: (value: number) => value.toLocaleString('en-US'),
    sorter: (a, b) => a.calls - b.calls,
    title: 'Calls',
  },
  {
    align: 'right',
    dataIndex: 'spend',
    defaultSortOrder: 'descend',
    render: (value: number) => `$${value.toFixed(2)}`,
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.spend - b.spend,
    title: 'Spend',
  },
  {
    fixed: 'right',
    key: 'action',
    render: () => <a href="#">Details</a>,
    title: 'Action',
    width: 90,
  },
];

export default () => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={{ pageSize: 5 }}
    rowKey="id"
    scroll={{ x: 'max-content', y: 260 }}
    size="small"
  />
);
```

`src/base-ui/Table/demos/server.tsx`:

```tsx
import { Table, type TableColumn, type TableSorterResult } from '@lobehub/ui/base-ui';
import { useMemo, useState } from 'react';

interface LogRow {
  createdAt: string;
  id: string;
  spend: number;
}

const all: LogRow[] = Array.from({ length: 42 }, (_, index) => ({
  createdAt: new Date(Date.UTC(2026, 8, 1 + (index % 26))).toISOString().slice(0, 10),
  id: String(index),
  spend: Math.round(((index * 37) % 100) * 1.7) / 10,
}));

const columns: TableColumn<LogRow>[] = [
  { dataIndex: 'createdAt', key: 'createdAt', sorter: true, title: 'Date' },
  { align: 'right', dataIndex: 'spend', key: 'spend', sorter: true, title: 'Spend' },
];

export default () => {
  const [page, setPage] = useState({ current: 1, pageSize: 10 });
  const [sorter, setSorter] = useState<TableSorterResult<LogRow>>({});

  const rows = useMemo(() => {
    const sorted = [...all];
    if (sorter.columnKey && sorter.order) {
      const key = sorter.columnKey as keyof LogRow;
      sorted.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (sorter.order === 'descend' ? -1 : 1));
    }
    return sorted.slice((page.current - 1) * page.pageSize, page.current * page.pageSize);
  }, [page, sorter]);

  return (
    <Table
      columns={columns}
      dataSource={rows}
      pagination={{ current: page.current, pageSize: page.pageSize, total: all.length }}
      rowKey="id"
      size="small"
      onChange={(pagination, _filters, nextSorter) => {
        setPage({ current: pagination.current ?? 1, pageSize: pagination.pageSize ?? 10 });
        setSorter(nextSorter);
      }}
    />
  );
};
```

`src/base-ui/Table/index.mdx`:

```mdx
---
title: Table
description: Data table with antd-shaped columns, local or server sorting, header filters, pagination, sticky header and fixed columns. Built on TanStack Table v9.
category: Data Display
---

import DemoIndex from './demos/index.tsx?demo';
import DemoServer from './demos/server.tsx?demo';

## Basic

Sort by clicking a header, filter from the funnel icon, page through with the pager. `scroll.y` keeps the header in view; `fixed: 'right'` pins the action column.

<Demo of={DemoIndex} layout="bare" />

## Server-driven

`sorter: true` leaves row order alone and reports the sort through `onChange`; `pagination.total` switches the pager to server mode. Fetch the page yourself and pass it as `dataSource`.

<Demo of={DemoServer} layout="bare" />

## APIs

<Api name="Table" from=".." />

### Migrating from antd Table

- `columns`, `dataSource`, `rowKey`, `pagination`, `onChange`, `onRow`, `rowClassName`, `scroll`, `size` (`small` / `middle`), `bordered`, `loading` and `tableLayout` keep their antd shape.
- `locale={{ emptyText }}` → `emptyText`.
- Delete `.ant-table-*` style overrides; use `classNames` / `styles` (`wrapper`, `header`, `body`, `row`, `cell`).
- Row selection, expandable rows, virtual scrolling, summary rows, tree data, column resizing, multi-column sort, controlled `sortOrder`, custom `filterDropdown` and array `dataIndex` paths are not supported.
```

- [ ] **Step 6: Verify**

Run: `pnpm exec eslint src/base-ui/Table`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E 'src/base-ui/Table'`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/base-ui/Table
git commit -m "✨ feat(base-ui): add Table header filters, docs and demos"
```

---

### Task 10: Whole-branch verification

**Files:**

- No new files. Fix anything the checks below surface in the files that caused it.

- [ ] **Step 1: Run every new and touched test suite**

Run: `pnpm vitest run src/base-ui/Divider src/base-ui/Statistic src/base-ui/Breadcrumb src/base-ui/Descriptions src/base-ui/Steps src/base-ui/List src/base-ui/Table src/Accordion src/chat/ChatList`
Expected: all PASS.

- [ ] **Step 2: Lint and type-check the changed files**

Run: `pnpm exec eslint $(git diff --name-only master -- 'src/**/*.ts' 'src/**/*.tsx')`
Expected: no errors.

Run: `pnpm exec tsc --noEmit 2>&1 | grep -E "$(git diff --name-only master -- 'src/**/*.ts' 'src/**/*.tsx' | paste -sd'|' -)"`
Expected: no output.

- [ ] **Step 3: Check the docs build accepts the new pages**

Run: `pnpm exec lobedocs typegen`
Expected: exits 0 with no validation errors naming the new `index.mdx` files.

- [ ] **Step 4: Visual check in the docs site**

Use the `local-testing` skill: start `pnpm dev`, open `/components/base-ui/divider`, `/statistic`, `/breadcrumb`, `/descriptions`, `/steps`, `/list`, `/table`, and check each demo in light and dark theme. On the Table page, click a sortable header, open the Provider filter, and page forward.
Expected: each page renders its demos without console errors; Table sort, filter and paging respond.

- [ ] **Step 5: Confirm antd is gone from the touched lobe-ui internals**

Run: `grep -nE "from 'antd'" src/Accordion/Accordion.tsx src/chat/ChatList/components/HistoryDivider.tsx`
Expected: no output.

- [ ] **Step 6: Commit fixes, if any**

```bash
git add -A src docs
git commit -m "🐛 fix(base-ui): address batch 8–10 verification findings"
```

Skip this step when Steps 1–5 needed no changes.
