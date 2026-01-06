---
nav: Components
group: Data Display
title: Popover
description: A floating card that displays additional content when triggered by hover or click.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Popover Group (Singleton)

Wrap multiple popovers in `PopoverGroup` to share a single floating instance. When you hover different triggers, the popover only updates the anchor + content, enabling smooth transitions.

<code src="./demos/group.tsx" nopadding></code>

## Header Navigation

A typical use case: navigation menus, notification panel, and user dropdown in a header.

<code src="./demos/trigger.tsx" nopadding></code>

## Placement

Popover supports 12 placement positions arranged in a visual grid layout.

<code src="./demos/placement.tsx" nopadding></code>

## Dropdown Menu

<code src="./demos/dropdown-menu.tsx" nopadding></code>

## Arrow & Inset

Use `arrow` for visual connection, or `inset` for dropdown-style menus.

<code src="./demos/inset.tsx" nopadding></code>

## Controlled Mode

Use `open` and `onOpenChange` for confirmation dialogs, inline editing, and external control.

<code src="./demos/controlled.tsx" nopadding></code>

## APIs

### Popover

| Property          | Description                                                        | Type                                                                                                                                                             | Default   |
| ----------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| content           | Content of the popover                                             | `ReactNode`                                                                                                                                                      | -         |
| arrow             | Whether to show the arrow                                          | `boolean`                                                                                                                                                        | `true`    |
| inset             | Render the popover inside the trigger                              | `boolean`                                                                                                                                                        | `false`   |
| trigger           | Trigger mode                                                       | `'hover' \| 'click' \| ('hover' \| 'click')[]`                                                                                                                   | `'hover'` |
| placement         | Position of the popover                                            | `'top' \| 'topLeft' \| 'topRight' \| 'bottom' \| 'bottomLeft' \| 'bottomRight' \| 'left' \| 'leftTop' \| 'leftBottom' \| 'right' \| 'rightTop' \| 'rightBottom'` | `'top'`   |
| open              | Controlled open state                                              | `boolean`                                                                                                                                                        | -         |
| defaultOpen       | Default open state                                                 | `boolean`                                                                                                                                                        | `false`   |
| onOpenChange      | Callback when open state changes                                   | `(open: boolean) => void`                                                                                                                                        | -         |
| openDelay         | Delay before opening (ms). Takes precedence over `mouseEnterDelay` | `number`                                                                                                                                                         | -         |
| closeDelay        | Delay before closing (ms). Takes precedence over `mouseLeaveDelay` | `number`                                                                                                                                                         | -         |
| mouseEnterDelay   | Delay before opening (seconds, AntD compatible)                    | `number`                                                                                                                                                         | `0.1`     |
| mouseLeaveDelay   | Delay before closing (seconds, AntD compatible)                    | `number`                                                                                                                                                         | `0.1`     |
| disabled          | Whether the popover is disabled                                    | `boolean`                                                                                                                                                        | `false`   |
| portalled         | Whether to render in a portal                                      | `boolean`                                                                                                                                                        | `true`    |
| getPopupContainer | Custom container for the popup                                     | `(triggerNode: HTMLElement) => HTMLElement`                                                                                                                      | -         |
| styles            | Custom styles for root/content/arrow                               | `{ root?: CSSProperties; content?: CSSProperties; arrow?: CSSProperties }`                                                                                       | -         |
| classNames        | Custom class names for root/content/arrow                          | `{ root?: string; content?: string; arrow?: string }`                                                                                                            | -         |
| className         | Class name for the popup container                                 | `string`                                                                                                                                                         | -         |
| zIndex            | z-index of the popover                                             | `number`                                                                                                                                                         | `1100`    |

Popover is built on top of `@base-ui/react/popover`. It provides an Ant Design compatible API for easy migration.

### PopoverGroup

| Property               | Description                                           | Type                                                                              | Default |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------- | ------- |
| children               | Popover subtree that shares a single popover instance | `ReactNode`                                                                       | -       |
| contentLayoutAnimation | Animate content layout when switching triggers        | `boolean`                                                                         | `true`  |
| ...props               | Shared popover props applied to each group member     | `Omit<PopoverProps, 'children' \| 'defaultOpen' \| 'open' \| 'ref' \| 'content'>` | -       |
