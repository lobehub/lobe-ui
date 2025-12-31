---
nav: Components
group: Navigation
title: ContextMenu
description: ContextMenu provides an imperative API to open a menu at the last pointer position. Render a host once and call showContextMenu with Menu items.
---

## Imperative

<code src="./demos/imperative.tsx" center></code>

## APIs

### showContextMenu

`showContextMenu(items)` opens the menu at the latest pointer position. Menu items are the same as `Menu`/`Dropdown` items. See [Menu](/components/menu) for details on item types.

| Name            | Description       | Type                                 |
| --------------- | ----------------- | ------------------------------------ |
| showContextMenu | Show context menu | `(items: GenericItemType[]) => void` |

### ContextMenuHost

Render once near the root to host imperative context menus.
