---
nav: Components
group: Navigation
title: Tabs
description: Tabs are used to display multiple sections of content within the same space on a webpage. They allow users to quickly switch between different sections of content without having to navigate away from the current page.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Tabs

| Property | Description                                    | Type                               | Default     |
| -------- | ---------------------------------------------- | ---------------------------------- | ----------- |
| compact  | Whether to use compact style with less padding | `boolean`                          | `false`     |
| variant  | Style variant of the tabs                      | `'square' \| 'rounded' \| 'point'` | `'rounded'` |
| items    | Content of tabs with array of tab items        | `TabsProps['items']`               | -           |

Additionally, Tabs inherits all properties from Ant Design's Tabs component, including commonly used props like:

| Property         | Description                         | Type                                     | Default    |
| ---------------- | ----------------------------------- | ---------------------------------------- | ---------- |
| activeKey        | Currently active TabPane's key      | `string`                                 | -          |
| defaultActiveKey | Initial active TabPane's key        | `string`                                 | First tab  |
| onChange         | Callback when active tab is changed | `(activeKey) => void`                    | -          |
| tabPosition      | Position of tabs                    | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    |
| size             | Size of tabs                        | `'large' \| 'middle' \| 'small'`         | `'middle'` |

### Tab Variants

The component supports the following style variants:

- `rounded`: Tabs with rounded corners (default)
- `square`: Tabs with square corners
- `point`: Tabs with point indicators
