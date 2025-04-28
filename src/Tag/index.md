---
nav: Components
group: Data Display
title: Tag
description: Tag is used for marking and categorizing content with small colorful labels. It offers multiple styles, sizes, and color options for different scenarios.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Color

<code src="./demos/Color.tsx" center></code>

## APIs

### Tag

| Property | Description                  | Type                                     | Default    |
| -------- | ---------------------------- | ---------------------------------------- | ---------- |
| color    | Custom color of the tag      | `AntTagProps['color'] \| 'info'`         | -          |
| size     | Size of the tag              | `'small' \| 'middle' \| 'large'`         | `'middle'` |
| variant  | Style variant of the tag     | `'filled' \| 'outlined' \| 'borderless'` | `'filled'` |
| onClick  | Callback when tag is clicked | `(e) => void`                            | -          |
| children | Content of tag               | `ReactNode`                              | -          |

Additionally, Tag inherits all properties from Ant Design's Tag component except for 'color', which has been enhanced with additional options.

### Color Presets

The component supports the following color presets:

#### System Colors

- `success`: Green color indicating successful actions
- `warning`: Yellow/orange color for warnings
- `error`: Red color for errors
- `info`: Blue color for informational content

#### Theme Colors

- `red`
- `volcano`
- `orange`
- `gold`
- `yellow`
- `lime`
- `green`
- `cyan`
- `blue`
- `geekblue`
- `purple`
- `magenta`
- `gray`

You can also provide any hex color code (e.g., `#ff5500`) for custom colors.
