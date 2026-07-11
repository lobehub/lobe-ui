---
nav: Components
group: Navigation
title: Tabs
description: Base UI-powered Tabs with iOS-flavored interactions — no hover background, tap-scale feedback, and a sliding active indicator across rounded / square / point variants.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Tabs/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Tabs/Tabs.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Implicit Initial Selection

<code src="./demos/implicitDefault.tsx" nopadding></code>

## Atom Components

<code src="./demos/atoms.tsx" nopadding></code>

## APIs

### Tabs

| Property         | Description                            | Type                               | Default        |
| ---------------- | -------------------------------------- | ---------------------------------- | -------------- |
| activeKey        | Controlled active item key             | `string`                           | -              |
| defaultActiveKey | Initial active item key (uncontrolled) | `string`                           | -              |
| items            | Tab configuration list                 | `TabsItem[]`                       | -              |
| onChange         | Callback when active key changes       | `(key: string) => void`            | -              |
| orientation      | Layout flow direction                  | `'horizontal' \| 'vertical'`       | `'horizontal'` |
| size             | Tab size                               | `'small' \| 'middle' \| 'large'`   | `'middle'`     |
| variant          | Active indicator style                 | `'rounded' \| 'square' \| 'point'` | `'rounded'`    |
| classNames       | Class names for each part              | `TabsClassNames`                   | -              |
| styles           | Inline styles for each part            | `TabsStyles`                       | -              |

### TabsItem

| Property | Description                 | Type        | Default |
| -------- | --------------------------- | ----------- | ------- |
| key      | Unique key                  | `string`    | -       |
| label    | Tab label                   | `ReactNode` | -       |
| icon     | Leading icon                | `ReactNode` | -       |
| children | Panel content               | `ReactNode` | -       |
| disabled | Whether the tab is disabled | `boolean`   | `false` |

### Variants

- `rounded` (default) — pill-shaped filled background slides between tabs.
- `square` — underline bar with square ends, anchored to the list bottom.
- `point` — small dot indicator centered under the active tab.
