---
nav: Components
group: General
title: ActionIconGroup
description: ActionIconGroup is a component for rendering multiple buttons with unified styling and layout control. It handles groups of ActionIcon components with consistent appearance and behavior.
---

## Introduction

ActionIconGroup is a container component for organizing and managing multiple ActionIcons. It provides unified styling and layout control, ensuring consistent presentation of multiple icon buttons.

## Basic Usage

<code src="./demos/index.tsx" nopadding></code>

## APIs

### ActionIconGroup

| Property        | Description                                           | Type                                                        | Default    |
| --------------- | ----------------------------------------------------- | ----------------------------------------------------------- | ---------- |
| actionIconProps | Additional props applied to all ActionIcon components | `Partial<Omit<ActionIconProps, 'icon' \| 'size' \| 'ref'>>` | -          |
| disabled        | Disable all action buttons                            | `boolean`                                                   | `false`    |
| glass           | Apply glass effect to the container                   | `boolean`                                                   | `false`    |
| horizontal      | Layout direction                                      | `boolean`                                                   | `true`     |
| items           | Array of action items to render                       | `MenuItemType[]`                                            | `[]`       |
| menu            | Dropdown menu configuration                           | `DropdownProps['menu']`                                     | -          |
| onActionClick   | Action click handler                                  | `(action: ActionIconGroupEvent) => void`                    | -          |
| shadow          | Add shadow effect to the container                    | `boolean`                                                   | `false`    |
| size            | Size of all action icons                              | `ActionIconProps['size']`                                   | `'small'`  |
| variant         | Style variant applied to all buttons                  | `'filled' \| 'outlined' \| 'borderless'`                    | `'filled'` |

### ActionIconGroupEvent

| Property | Description                      | Type         |
| -------- | -------------------------------- | ------------ |
| key      | The key of the clicked item      | `string`     |
| keyPath  | The key path of the clicked item | `string[]`   |
| domEvent | The DOM event                    | `MouseEvent` |
