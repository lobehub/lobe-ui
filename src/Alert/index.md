---
nav: Components
group: Feedback
title: Alert
description: Alert is a component used to display important messages or notifications to the user. It can be customized with different types, icons, and actions.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Extra

<code src="./demos/Extra.tsx" nopadding></code>

## APIs

### Alert

| Property           | Description                                      | Type                                          | Default    |
| ------------------ | ------------------------------------------------ | --------------------------------------------- | ---------- |
| banner             | Whether to show as banner                        | `boolean`                                     | `false`    |
| classNames         | Custom class names for Alert components          | `{ alert?: string; container?: string }`      | -          |
| closable           | Whether Alert can be closed                      | `boolean`                                     | `false`    |
| closeIcon          | Custom close icon                                | `ReactNode`                                   | -          |
| colorfulText       | Whether to use colorful text based on alert type | `boolean`                                     | `true`     |
| description        | Additional description text                      | `ReactNode`                                   | -          |
| extra              | Additional content below the Alert               | `ReactNode`                                   | -          |
| extraDefaultExpand | Whether to expand extra content by default       | `boolean`                                     | `false`    |
| extraIsolate       | Whether to show extra content separately         | `boolean`                                     | `false`    |
| glass              | Apply glass effect to Alert background           | `boolean`                                     | `false`    |
| icon               | Custom icon component                            | `IconProps['icon']`                           | -          |
| iconProps          | Properties for the icon component                | `Omit<IconProps, 'icon'>`                     | -          |
| message            | Content of Alert                                 | `ReactNode`                                   | -          |
| showIcon           | Whether to show icon                             | `boolean`                                     | `true`     |
| text               | Customization options for text                   | `{ detail?: string }`                         | -          |
| type               | Type of Alert                                    | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'`   |
| variant            | Style variant of Alert                           | `'filled' \| 'outlined' \| 'borderless'`      | `'filled'` |
