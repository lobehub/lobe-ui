---
nav: Components
group: Navigation
title: DraggableSideNav
description: A generic resizable side panel container with collapse/expand functionality. Supports custom header, body, and footer content with smart drag-to-collapse behavior.
---

## Default

<code src="./demos/index.tsx" noPadding></code>

## APIs

| Property          | Description                                 | Type                                                                                                                                                   | Default  |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| children          | Body content (main content area)            | `ReactNode \| ((collapsed: boolean) => ReactNode)`                                                                                                     | -        |
| header            | Header content                              | `ReactNode \| ((collapsed: boolean) => ReactNode)`                                                                                                     | -        |
| footer            | Footer content                              | `ReactNode \| ((collapsed: boolean) => ReactNode)`                                                                                                     | -        |
| collapsed         | Whether the panel is collapsed (controlled) | `boolean`                                                                                                                                              | -        |
| defaultCollapsed  | Whether the panel is collapsed by default   | `boolean`                                                                                                                                              | `false`  |
| placement         | Placement of the side nav                   | `'left' \| 'right'`                                                                                                                                    | `'left'` |
| resizable         | Whether to enable resizing                  | `boolean`                                                                                                                                              | `true`   |
| minWidth          | Minimum width (also the collapsed width)    | `number`                                                                                                                                               | `64`     |
| maxWidth          | Maximum width                               | `number`                                                                                                                                               | -        |
| size              | Current size (controlled)                   | `Partial<Size>`                                                                                                                                        | -        |
| defaultSize       | Default width when expanded                 | `Partial<Size>`                                                                                                                                        | -        |
| showHandle        | Whether to show handle for toggling         | `boolean`                                                                                                                                              | `true`   |
| onCollapsedChange | Callback when collapse state changes        | `(collapsed: boolean) => void`                                                                                                                         | -        |
| onSizeChange      | Callback when size changes                  | `(delta: NumberSize, size?: Size) => void`                                                                                                             | -        |
| onSizeDragging    | Callback when actively resizing             | `(delta: NumberSize, size?: Size) => void`                                                                                                             | -        |
| classNames        | Classnames for internal components          | `{ container?: string; content?: string; handle?: string; body?: string; header?: string; footer?: string }`                                           | -        |
| styles            | Custom styles for internal components       | `{ container?: CSSProperties; content?: CSSProperties; handle?: CSSProperties; body?: CSSProperties; header?: CSSProperties; footer?: CSSProperties }` | -        |

## Features

- 🎯 **Generic Container**: Not tied to Menu - use any content you want
- 📏 **Smart Dragging**: Drag to resize with smart auto-collapse/expand behavior
- 🔄 **Dynamic Content**: header, children, and footer can be functions receiving collapsed state
- 🎨 **Flexible Layout**: Customize header, body, and footer independently
- ⚡ **Smooth Animations**: Animated width transitions when toggling collapse/expand
- 🎛️ **Full Control**: Controlled or uncontrolled mode

## Notes

- **Generic Container**: DraggableSideNav is a generic resizable container, not limited to navigation menus
- **Dynamic Rendering**: Use function props to render different content based on collapsed state
- `minWidth` serves as both the minimum draggable width and the collapsed width (default 64px)
- Only horizontal resizing is supported (width adjustment)
- **Smart Collapse**: Dragging below the collapse threshold triggers auto-collapse with animation
- **Smooth Animation**: Clicking the handle triggers a 300ms width transition animation
- Use with any content: Menu, custom navigation, sidebars, panels, etc.
