---
nav: Components
group: Navigation
title: ContextMenu
description: ContextMenu provides an imperative API to open a menu at the last pointer position. Render a host once and call showContextMenu with Menu items.
---

## Imperative

<code src="./demos/imperative.tsx" center></code>

## Trigger State

<code src="./demos/trigger.tsx" center></code>

## Checkbox Items

<code src="./demos/checkbox.tsx" center></code>

## Switch Items

<code src="./demos/switch.tsx" center></code>

## Empty Submenu

<code src="./demos/emptySubmenu.tsx" center></code>

## Uploader

<code src="./demos/uploader.tsx" center></code>

## APIs

### showContextMenu

`showContextMenu(items)` opens the menu at the latest pointer position. Menu items are the same as `Menu`/`Dropdown` items. See [Menu](/components/menu) for details on item types.

| Name            | Description       | Type                                 |
| --------------- | ----------------- | ------------------------------------ |
| showContextMenu | Show context menu | `(items: ContextMenuItem[]) => void` |

### ContextMenuHost

Render once near the root to host imperative context menus.

### ContextMenuTrigger

Declarative trigger wrapper that attaches open state attributes (`data-popup-open`, `data-state`, `aria-expanded`) for styling alignment with DropdownMenu. Use `onContextMenu` to call `showContextMenu`.
