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

## Description

Items can display a secondary description below the label using the `desc` property.

<code src="./demos/desc.tsx" center></code>

## Header & Footer

Pass `header` and `footer` to `showContextMenu` (or to `ContextMenuTrigger`) to pin custom content above and below the scrollable items area. Both slots carry a divider border. Slot content is not a menu item: it is not keyboard-navigable, and clicking it does not close the menu — close it via `closeContextMenu()`.

<code src="./demos/header-footer.tsx" center></code>

When the items exceed the available height, the items area scrolls while the header and footer stay pinned.

<code src="./demos/header-footer-scroll.tsx" center></code>

## Empty Submenu

<code src="./demos/emptySubmenu.tsx" center></code>

## Uploader

<code src="./demos/uploader.tsx" center></code>

## Icon Space Mode

Control how icon spacing is reserved across menu items. In `global` mode (default), if any item has an icon, all items reserve icon space. In `group` mode, only groups containing icons reserve icon space.

<code src="./demos/iconSpaceMode.tsx" center></code>

## APIs

### showContextMenu

`showContextMenu(items, options?)` opens the menu at the latest pointer position. Menu items are the same as `Menu`/`Dropdown` items. See [Menu](/components/menu) for details on item types.

| Name            | Description       | Type                                                                   |
| --------------- | ----------------- | ---------------------------------------------------------------------- |
| showContextMenu | Show context menu | `(items: ContextMenuItem[], options?: ShowContextMenuOptions) => void` |

#### ShowContextMenuOptions

| Property      | Description                                                                                    | Type                  | Default    |
| ------------- | ---------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| footer        | Pinned footer slot rendered below the scrollable items area                                    | `ReactNode`           | -          |
| header        | Pinned header slot rendered above the scrollable items area                                    | `ReactNode`           | -          |
| iconAlign     | Icon vertical alignment when items have `desc`. Only effective with descriptions.              | `'center' \| 'start'` | `'center'` |
| iconSpaceMode | Icon space reservation: `global` reserves for all items, `group` reserves per group with icons | `'global' \| 'group'` | `'global'` |

### ContextMenuHost

Render once near the root to host imperative context menus.

### ContextMenuTrigger

Declarative trigger wrapper that attaches open state attributes (`data-popup-open`, `data-state`, `aria-expanded`) for styling alignment with DropdownMenu. Use `onContextMenu` to call `showContextMenu`. When the `items` prop is provided, the optional `header` and `footer` props are forwarded to the menu.
