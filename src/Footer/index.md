---
nav: Components
group: Layout
title: Footer
description: The Footer component is used to display a website footer. It supports various customization options like column layout, bottom content, and theme selection.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property        | Description                                 | Type                 | Default |
| --------------- | ------------------------------------------- | -------------------- | ------- |
| columns         | Column configuration for footer content     | `RcProps['columns']` | -       |
| bottom          | Additional content to display at the bottom | `ReactNode`          | -       |
| theme           | Theme of the footer                         | `'light' \| 'dark'`  | -       |
| contentMaxWidth | Maximum width for the footer content        | `number`             | -       |

> Additional props are inherited from `FlexboxProps` from the react-layout-kit library.
