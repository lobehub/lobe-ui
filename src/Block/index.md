---
nav: Components
group: General
title: Block
---

Block is a flexible container component that extends Flexbox with various styling options like variants, shadows, and glass effects.

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property  | Description                                         | Type                                     | Default    |
| --------- | --------------------------------------------------- | ---------------------------------------- | ---------- |
| variant   | The style variant of the block                      | `'filled' \| 'outlined' \| 'borderless'` | `'filled'` |
| shadow    | Whether to show a shadow effect                     | `boolean`                                | `false`    |
| glass     | Whether to add a glass effect                       | `boolean`                                | `false`    |
| clickable | Whether the block is clickable (adds hover effects) | `boolean`                                | `false`    |

> Block component inherits all properties from [Flexbox](https://github.com/ant-design/react-layout-kit)
