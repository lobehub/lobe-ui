---
nav: Components
group: Feedback
title: Drawer
description: Drawer is a panel that slides in from the edge of the screen. It can be used to display additional content or provide user interaction options without navigating away from the current view.
---

## Default

<code src="./demos/index.tsx" noPadding></code>

## Sidebar

<code src="./demos/Sidebar.tsx" noPadding></code>

## APIs

### Drawer

| Property          | Description                                       | Type                                                                                                                                                                  | Default   |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| classNames        | Custom class names for Drawer elements            | `AntdDrawerProps['classNames'] & { bodyContent?: string; extra?: string; sidebar?: string; sidebarContent?: string; title?: string; }`                                | -         |
| closeIconProps    | Properties for the close icon button              | `ActionIconProps`                                                                                                                                                     | -         |
| containerMaxWidth | Maximum width of the drawer container             | `number`                                                                                                                                                              | `1024`    |
| noHeader          | Whether to hide the drawer header                 | `boolean`                                                                                                                                                             | `false`   |
| sidebar           | Content to display in the sidebar area            | `ReactNode`                                                                                                                                                           | -         |
| sidebarWidth      | Width of the sidebar                              | `number`                                                                                                                                                              | `280`     |
| styles            | Custom styles for Drawer elements                 | `AntdDrawerProps['styles'] & { bodyContent?: CSSProperties; extra?: CSSProperties; sidebar?: CSSProperties; sidebarContent?: CSSProperties; title?: CSSProperties; }` | -         |
| title             | Title of the drawer                               | `ReactNode`                                                                                                                                                           | -         |
| placement         | Position where the drawer appears                 | `'top' \| 'right' \| 'bottom' \| 'left'`                                                                                                                              | `'right'` |
| width             | Width of the drawer                               | `number \| string`                                                                                                                                                    | `378`     |
| height            | Height of the drawer when placed at top or bottom | `number \| string`                                                                                                                                                    | `378`     |
| open              | Whether the drawer is visible                     | `boolean`                                                                                                                                                             | `false`   |
| onClose           | Callback when the drawer is closed                | `() => void`                                                                                                                                                          | -         |
| children          | Content of the drawer                             | `ReactNode`                                                                                                                                                           | -         |

Additionally, Drawer inherits all properties from Ant Design's Drawer component except for `styles` and `classNames`, which have been extended with additional options.
