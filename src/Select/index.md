---
nav: Components
group: Data Entry
title: Select
description: Select component lets users choose from a list of options in a dropdown menu. It supports various styling options and custom suffix icons.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Select

| Property        | Description                         | Type                                     | Default                                            |
| --------------- | ----------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| shadow          | Enable shadow effect for the select | `boolean`                                | `false`                                            |
| suffixIcon      | Custom suffix icon                  | `IconProps['icon']`                      | `ChevronDownIcon`                                  |
| suffixIconProps | Props for the suffix icon           | `Omit<IconProps, 'icon'>`                | -                                                  |
| variant         | Style variant of the select         | `'filled' \| 'outlined' \| 'borderless'` | Dark mode: `'filled'`<br/>Light mode: `'outlined'` |

Select inherits all properties from Ant Design's Select component except for 'suffixIcon', which has been enhanced to support Lucide icons directly. The component automatically adjusts its appearance based on the current theme (light/dark mode) unless a specific variant is provided.
