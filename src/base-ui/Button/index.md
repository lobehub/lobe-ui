---
nav: Components
group: General
title: Button
description: Polished base-ui Button. API-compatible drop-in for antd Button core props.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Button/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Button/Button.tsx'
---

## Type, danger & ghost

<code src="./demos/index.tsx" nopadding></code>

## Sizes, shapes & block

<code src="./demos/sizes.tsx" nopadding></code>

## Icons, loading & link

<code src="./demos/icons.tsx" nopadding></code>

## Split button

Compose a primary action and a dropdown menu sharing the same visual props.

<code src="./demos/split.tsx" nopadding></code>

## API

| Property     | Description                                              | Type                                                               | Default     |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------------ | ----------- |
| type         | Visual style                                             | `'default' \| 'primary' \| 'dashed' \| 'fill' \| 'link' \| 'text'` | `'default'` |
| danger       | Danger color modifier                                    | `boolean`                                                          | `false`     |
| ghost        | Transparent background variant (for colored backgrounds) | `boolean`                                                          | `false`     |
| size         | Button size                                              | `'small' \| 'middle' \| 'large'`                                   | `'middle'`  |
| shape        | Button shape                                             | `'default' \| 'circle' \| 'round'`                                 | `'default'` |
| icon         | Icon node rendered next to the children                  | `ReactNode`                                                        | -           |
| iconPosition | Where to place the icon                                  | `'start' \| 'end'`                                                 | `'start'`   |
| loading      | Show a spinner and disable interaction                   | `boolean`                                                          | `false`     |
| disabled     | Disabled state                                           | `boolean`                                                          | `false`     |
| block        | Stretch to fill container width                          | `boolean`                                                          | `false`     |
| href         | Render as an `<a>` element                               | `string`                                                           | -           |
| target       | Anchor target when `href` is set                         | `string`                                                           | -           |
| htmlType     | Underlying `<button>` type when not rendered as `<a>`    | `'button' \| 'submit' \| 'reset'`                                  | `'button'`  |
| classNames   | Per-slot class names                                     | `{ icon?: string }`                                                | -           |
| styles       | Per-slot inline styles                                   | `{ icon?: CSSProperties }`                                         | -           |

The component forwards all standard `<button>` (or `<a>` when `href` is set) HTML attributes including `onClick`, `aria-*`, `data-*`, and `ref`.

## Migrating from `antd`'s `Button`

The props listed above match antd `Button`'s behaviour, so most call sites swap import only. Styling matches the rest of `base-ui` — tighter heights (`24 / 32 / 40` for `small / middle / large`) and a subtle hover micro-lift, no hover shadow.
