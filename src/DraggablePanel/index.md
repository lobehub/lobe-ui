---
nav: Components
group: Layout
title: DraggablePanel
description: DraggablePanel is a panel that can be dragged and resized. It supports pinning, fixed or floating mode, placement in four directions, minimum width and height, expandable or not, default and customizable size, and destroy on close. It also provides a handler for expanding and collapsing the panel.
---

## Default

<code src="./demos/index.tsx" noPadding></code>

## Layout

<code src="./demos/Layout.tsx" noPadding></code>

## Stable Layout

<code src="./demos/StableLayout.tsx" noPadding></code>

## Drag to Collapse

<code src="./demos/DragToCollapse.tsx" noPadding></code>

## APIs

| Property                | Description                                                | Type                                                   | Default   |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------ | --------- |
| placement               | Position of the panel                                      | `'right' \| 'left' \| 'top' \| 'bottom'`               | -         |
| mode                    | Display mode of the panel                                  | `'fixed' \| 'float'`                                   | `'float'` |
| expand                  | Whether the panel is expanded                              | `boolean`                                              | -         |
| defaultExpand           | Default expand state                                       | `boolean`                                              | `true`    |
| expandable              | Whether the panel can be expanded/collapsed                | `boolean`                                              | `true`    |
| pin                     | Whether the panel is pinned                                | `boolean`                                              | `false`   |
| size                    | Size of the panel                                          | `Partial<Size>`                                        | -         |
| defaultSize             | Default size of the panel                                  | `Partial<Size>`                                        | -         |
| minWidth                | Minimum width of the panel                                 | `number`                                               | -         |
| maxWidth                | Maximum width of the panel                                 | `number`                                               | -         |
| minHeight               | Minimum height of the panel                                | `number`                                               | -         |
| maxHeight               | Maximum height of the panel                                | `number`                                               | -         |
| headerHeight            | Height of the panel header                                 | `number`                                               | -         |
| fullscreen              | Whether the panel is in fullscreen mode                    | `boolean`                                              | `false`   |
| resize                  | Enable/disable resizing                                    | `RndProps['enableResizing']`                           | -         |
| destroyOnClose          | Whether to destroy panel content when collapsed            | `boolean`                                              | `false`   |
| showHandleWhenCollapsed | Whether to show the drag handle when panel is collapsed    | `boolean`                                              | `true`    |
| showHandleWideArea      | Whether to display a wider handle area for easier dragging | `boolean`                                              | `false`   |
| stableLayout            | Keep inner layout stable during collapse/expand animations | `boolean`                                              | `false`   |
| onExpandChange          | Callback when expand state changes                         | `(expand: boolean) => void`                            | -         |
| onSizeChange            | Callback when size changes                                 | `(delta: NumberSize, size?: Size) => void`             | -         |
| onSizeDragging          | Callback when size is being dragged                        | `(delta: NumberSize, size?: Size) => void`             | -         |
| classNames              | Custom class names for panel elements                      | `{ content?: string; handle?: string; }`               | -         |
| styles                  | Custom styles for panel elements                           | `{ content?: CSSProperties; handle?: CSSProperties; }` | -         |
