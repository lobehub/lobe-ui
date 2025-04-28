---
nav: Components
group: Layout
title: Layout
description: The Layout component is used to create a basic layout structure with header, footer, sidebar and content areas. It provides customizable props such as headerHeight, asideWidth and tocWidth to adjust the size of each area. It also includes sub-components such as LayoutHeader, LayoutMain, LayoutSidebar, LayoutToc and LayoutFooter, which can be used independently for more flexibility. The component is responsive to different screen sizes with the help of useResponsive hook.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Layout

| Property     | Description                              | Type        | Default |
| ------------ | ---------------------------------------- | ----------- | ------- |
| headerHeight | Height of the header area                | `number`    | -       |
| asideWidth   | Width of the sidebar area                | `number`    | -       |
| tocWidth     | Width of the table of contents area      | `number`    | -       |
| children     | Primary content                          | `ReactNode` | -       |
| content      | Alternative way to specify content       | `ReactNode` | -       |
| header       | Content for the header area              | `ReactNode` | -       |
| footer       | Content for the footer area              | `ReactNode` | -       |
| sidebar      | Content for the sidebar area             | `ReactNode` | -       |
| toc          | Content for the table of contents area   | `ReactNode` | -       |
| helmet       | Additional content for the document head | `ReactNode` | -       |

### LayoutHeader

| Property     | Description          | Type     | Default |
| ------------ | -------------------- | -------- | ------- |
| headerHeight | Height of the header | `number` | -       |

### LayoutSidebar / LayoutSidebarInner

| Property     | Description                         | Type     | Default |
| ------------ | ----------------------------------- | -------- | ------- |
| headerHeight | Height of the header to offset from | `number` | -       |

### LayoutToc

| Property | Description                    | Type     | Default |
| -------- | ------------------------------ | -------- | ------- |
| tocWidth | Width of the table of contents | `number` | -       |

> All layout components extend the `DivProps` interface, inheriting all standard HTML div element attributes.
