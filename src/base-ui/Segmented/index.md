---
nav: Components
group: Data Entry
title: Segmented
description: Base UI-powered Segmented control — toggle-group semantics with a sliding active indicator. Drops antd dependency in favor of @base-ui/react/toggle-group.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Segmented/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Segmented/Segmented.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Atom Components

<code src="./demos/atoms.tsx" nopadding></code>

## APIs

### Segmented

| Property     | Description                         | Type                             | Default    |
| ------------ | ----------------------------------- | -------------------------------- | ---------- |
| value        | Controlled active value             | `string`                         | -          |
| defaultValue | Initial active value (uncontrolled) | `string`                         | -          |
| options      | Option configuration list           | `SegmentedOptions`               | -          |
| onChange     | Callback when active value changes  | `(value: string) => void`        | -          |
| size         | Item size                           | `'small' \| 'middle' \| 'large'` | `'middle'` |
| variant      | Outer container style               | `'filled' \| 'outlined'`         | `'filled'` |
| shadow       | Whether to add elevation shadow     | `boolean`                        | `false`    |
| glass        | Whether to apply frosted-glass blur | `boolean`                        | `false`    |
| block        | Whether items stretch to fill width | `boolean`                        | `false`    |
| vertical     | Whether to lay items vertically     | `boolean`                        | `false`    |
| disabled     | Disable the whole group             | `boolean`                        | `false`    |
| classNames   | Class names for each part           | `SegmentedClassNames`            | -          |
| styles       | Inline styles for each part         | `SegmentedStyles`                | -          |

### SegmentedOption

| Property | Description                  | Type        | Default |
| -------- | ---------------------------- | ----------- | ------- |
| value    | Unique value                 | `string`    | -       |
| label    | Option label                 | `ReactNode` | -       |
| icon     | Leading icon                 | `ReactNode` | -       |
| disabled | Whether the item is disabled | `boolean`   | `false` |
| title    | Native title attribute       | `string`    | -       |

`options` also accepts an array of plain strings as shorthand: `['Light', 'Dark']` is equivalent to `[{ value: 'Light', label: 'Light' }, ...]`.
