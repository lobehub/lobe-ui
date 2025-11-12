---
nav: Components
group: Navigation
title: DraggableSideNav
description: A generic resizable side panel container with collapse/expand functionality. Supports custom header, body, and footer content with smart drag-to-collapse behavior.
---

## Default

<code src="./demos/index.tsx" noPadding></code>

## APIs

| Property                | Description                                                       | Type                                                                                                                                                   | Default  |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| children                | Body content (main content area)                                  | `ReactNode \| ((expand: boolean) => ReactNode)`                                                                                                        | -        |
| header                  | Header content                                                    | `ReactNode \| ((expand: boolean) => ReactNode)`                                                                                                        | -        |
| footer                  | Footer content                                                    | `ReactNode \| ((expand: boolean) => ReactNode)`                                                                                                        | -        |
| expand                  | Whether the panel is expanded (controlled)                        | `boolean`                                                                                                                                              | -        |
| defaultExpand           | Whether the panel is expanded by default                          | `boolean`                                                                                                                                              | `true`   |
| expandable              | Whether the panel can be expanded/collapsed                       | `boolean`                                                                                                                                              | `true`   |
| width                   | Current width (controlled)                                        | `number`                                                                                                                                               | -        |
| defaultWidth            | Default width when expanded                                       | `number`                                                                                                                                               | `280`    |
| placement               | Placement of the side nav                                         | `'left' \| 'right'`                                                                                                                                    | `'left'` |
| resizable               | Whether to enable resizing                                        | `boolean`                                                                                                                                              | `true`   |
| minWidth                | Minimum width (also the collapsed width)                          | `number`                                                                                                                                               | `64`     |
| maxWidth                | Maximum width                                                     | `number`                                                                                                                                               | -        |
| showHandle              | Whether to show handle for toggling                               | `boolean`                                                                                                                                              | `true`   |
| showHandleWhenCollapsed | Whether to show handle when collapsed                             | `boolean`                                                                                                                                              | `false`  |
| animation               | Animation configuration. Set to `false` to disable all animations | `false \| { blur?: boolean, fade?: boolean, header?: boolean, body?: boolean, footer?: boolean }`                                                      | -        |
| onExpandChange          | Callback when expand state changes                                | `(expand: boolean) => void`                                                                                                                            | -        |
| onWidthChange           | Callback when width changes                                       | `(delta: NumberSize, width: number) => void`                                                                                                           | -        |
| onWidthDragging         | Callback when actively resizing width                             | `(delta: NumberSize, width: number) => void`                                                                                                           | -        |
| classNames              | Classnames for internal components                                | `{ container?: string; content?: string; handle?: string; body?: string; header?: string; footer?: string }`                                           | -        |
| styles                  | Custom styles for internal components                             | `{ container?: CSSProperties; content?: CSSProperties; handle?: CSSProperties; body?: CSSProperties; header?: CSSProperties; footer?: CSSProperties }` | -        |

## Features

- 🎯 **Generic Container**: Not tied to Menu - use any content you want
- 📏 **Smart Dragging**: Drag to resize with smart auto-collapse/expand behavior and glowing indicator
- 🔄 **Dynamic Content**: header, children, and footer can be functions receiving collapsed state
- 🎨 **Flexible Layout**: Customize header, body, and footer independently
- ⚡ **Smooth Animations**: 400ms width transitions with natural easing curves
- ✨ **Stunning Effects**: Blur + opacity fade animations for silky content transitions
- 🎭 **Micro-interactions**: Hover scale, click feedback, backdrop-blur glass effect
- 🎛️ **Full Control**: Controlled or uncontrolled mode

## Notes

- **Generic Container**: DraggableSideNav is a generic resizable container, not limited to navigation menus
- **Dynamic Rendering**: Use function props to render different content based on expand state
- `minWidth` serves as both the minimum draggable width and the collapsed width (default 64px)
- Only horizontal resizing is supported (width adjustment)
- **Smart Collapse**: Dragging below the collapse threshold triggers auto-collapse with animation
- **Performance Optimization**: Set `animation={false}` to disable all animations and remove animation wrappers, reducing overhead for better performance
- **Enhanced Animations**:
  - Width transition: 400ms with natural cubic-bezier easing
  - Fade effects: 300ms enter / 200ms exit with optional blur
  - Handle: Hover scale (1.05x), rotate animation
  - Resize indicator: Glowing theme color with smooth transitions
- **Fade Animations**: Enable fade effects for header, body, or footer individually with optional blur effect for stunning content transitions using framer-motion
- **Visual Polish**: Backdrop blur, smooth scrollbar, subtle shadows, micro-interactions
- Use with any content: Menu, custom navigation, sidebars, panels, etc.
