---
nav: Components
group: Layout
title: ScrollShadow
description: ScrollShadow is a component that adds shadow indicators to scrollable content to show overflow in different directions. It automatically detects scroll status and shows or hides shadows accordingly.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property           | Description                      | Type                                                                                         | Default      |
| ------------------ | -------------------------------- | -------------------------------------------------------------------------------------------- | ------------ |
| orientation        | Direction of the scroll          | `'vertical' \| 'horizontal'`                                                                 | `'vertical'` |
| hideScrollBar      | Whether to hide the scrollbar    | `boolean`                                                                                    | `false`      |
| size               | Size of the shadow in pixels     | `number`                                                                                     | `40`         |
| offset             | Offset to trigger the shadow     | `number`                                                                                     | `0`          |
| visibility         | When to show the shadow          | `'auto' \| 'always' \| 'never'`                                                              | `'auto'`     |
| isEnabled          | Whether the component is enabled | `boolean`                                                                                    | `true`       |
| onVisibilityChange | Callback when visibility changes | `(visibility: { bottom?: boolean, left?: boolean, right?: boolean, top?: boolean }) => void` | -            |
