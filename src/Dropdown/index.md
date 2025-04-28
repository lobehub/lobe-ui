---
nav: Components
group: Navigation
title: Dropdown
description: Dropdown displays a list of options that appear when users click or hover over a trigger element. It's commonly used for showing context menus, additional actions, or navigation options.
---

## default

<code src="./demos/index.tsx" center></code>

## ContextMenu

<code src="./demos/ContextMenu.tsx" center></code>

## APIs

### Dropdown

| Property  | Description                                | Type                                                                                        | Default        |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------- | -------------- |
| menu      | Configuration for dropdown menu            | `MenuProps`                                                                                 | -              |
| iconProps | Global configuration for icons in dropdown | `IconContentConfig`                                                                         | -              |
| children  | Trigger element                            | `ReactNode`                                                                                 | -              |
| trigger   | Events that trigger dropdown               | `('click' \| 'hover' \| 'contextMenu')[]`                                                   | `['hover']`    |
| placement | Position of dropdown menu                  | `'bottomLeft' \| 'bottomCenter' \| 'bottomRight' \| 'topLeft' \| 'topCenter' \| 'topRight'` | `'bottomLeft'` |

Additionally, Dropdown inherits all properties from Ant Design's Dropdown component except for the `menu` property, which has been enhanced.

### DropdownMenuItemType

Menu items for dropdown are the same as those used for the Menu component. See [Menu](/components/menu) for more details about item configuration.

| Property | Description                     | Type                | Default |
| -------- | ------------------------------- | ------------------- | ------- |
| key      | Unique identifier for menu item | `string`            | -       |
| label    | Display content of menu item    | `ReactNode`         | -       |
| icon     | Icon for menu item              | `IconProps['icon']` | -       |
| danger   | Whether menu item is dangerous  | `boolean`           | `false` |
| disabled | Whether menu item is disabled   | `boolean`           | `false` |
