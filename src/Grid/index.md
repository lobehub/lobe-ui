---
nav: Components
group: Layout
title: Grid
description: Grid is a responsive layout component that arranges child elements in a grid pattern. It automatically adjusts the number of columns based on available space.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Grid

| Property     | Description                                      | Type               | Default |
| ------------ | ------------------------------------------------ | ------------------ | ------- |
| gap          | Spacing between grid items                       | `string \| number` | `'1em'` |
| maxItemWidth | Maximum width of each grid item                  | `string \| number` | `240`   |
| rows         | Maximum number of columns at the widest viewport | `number`           | `3`     |
| children     | Content to be displayed in the grid              | `ReactNode`        | -       |

Additionally, Grid inherits all properties from the Flexbox component (from react-layout-kit) except for 'gap', which has been enhanced with additional functionality.
