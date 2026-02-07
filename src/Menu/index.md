---
nav: Components
group: Navigation
title: Menu
description: Menu is a navigation component that provides a list of options for user selection. It supports various item types including normal items, sub-menus, dividers, and item groups with customizable icons and styles.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property   | Description                                      | Type                                     | Default        |
| ---------- | ------------------------------------------------ | ---------------------------------------- | -------------- |
| items      | Menu items to be displayed                       | `ItemType[]`                             | -              |
| variant    | Style variant of the menu                        | `'filled' \| 'outlined' \| 'borderless'` | `'borderless'` |
| compact    | Whether to use compact mode with smaller spacing | `boolean`                                | `false`        |
| shadow     | Whether to show a shadow effect                  | `boolean`                                | `false`        |
| iconProps  | Configuration for icons in menu items            | `IconContentConfig`                      | -              |
| selectable | Whether menu items are selectable                | `boolean`                                | -              |

### ItemType

| Property | Description                           | Type                          |
| -------- | ------------------------------------- | ----------------------------- |
| key      | Unique identifier for the item        | `Key`                         |
| label    | Content of the menu item              | `ReactNode`                   |
| title    | Title attribute of the item           | `string`                      |
| icon     | Icon of the menu item                 | `ReactNode \| IconDefinition` |
| desc     | Secondary description below the label | `ReactNode`                   |
| danger   | Whether the item has danger style     | `boolean`                     |
| disabled | Whether the item is disabled          | `boolean`                     |
| children | Sub-items for sub-menu or group       | `ItemType[]`                  |
| type     | Type of menu item                     | `'group' \| 'divider'`        |
| dashed   | For divider type, whether it's dashed | `boolean`                     |
