---
nav: Components
group: Data Display
title: Popover
description: A floating card that displays additional content when triggered by hover or click.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Atom Components

Exported primitives can be composed to build custom popovers.

<code src="./demos/atoms.tsx" nopadding></code>

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

## Context (Imperative)

Popover provides an internal context so that content can close the current popover without switching to controlled mode.

<code src="./demos/context.tsx" nopadding></code>

## Inset Panel

<code src="./demos/inset-panel.tsx" nopadding></code>

## Tooltip Inside Popover

When using Tooltip inside Popover, the Tooltip will automatically render into the Popover's container to avoid z-index stacking issues.

<code src="./demos/tooltip-inside.tsx" nopadding></code>

## APIs

### Popover

| Property          | Description                                                        | Type                                                                                                                                                             | Default   |
| ----------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| content           | Content of the popover                                             | `ReactNode`                                                                                                                                                      | -         |
| arrow             | Whether to show the arrow                                          | `boolean`                                                                                                                                                        | `false`   |
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
| standalone        | Render independently even inside a PopoverGroup                    | `boolean`                                                                                                                                                        | `false`   |
| getPopupContainer | Custom container for the popup                                     | `(triggerNode: HTMLElement) => HTMLElement`                                                                                                                      | -         |
| positionerProps   | Props passed to Base UI Positioner component                       | `PopoverPositionerProps`                                                                                                                                         | -         |
| triggerProps      | Props passed to Base UI Trigger component                          | `PopoverTriggerComponentProps`                                                                                                                                   | -         |
| popupProps        | Props passed to Base UI Popup component                            | `PopoverPopupProps`                                                                                                                                              | -         |
| portalProps       | Props passed to Base UI Portal component                           | `PopoverPortalProps`                                                                                                                                             | -         |
| backdropProps     | Props passed to Base UI Backdrop component                         | `PopoverBackdropProps`                                                                                                                                           | -         |
| styles            | Custom styles for root/content/arrow                               | `{ root?: CSSProperties; content?: CSSProperties; arrow?: CSSProperties }`                                                                                       | -         |
| classNames        | Custom class names for root/content/arrow/trigger                  | `{ root?: string; content?: string; arrow?: string; trigger?: string }`                                                                                          | -         |
| className         | Class name for the popup container                                 | `string`                                                                                                                                                         | -         |
| zIndex            | z-index of the popover                                             | `number`                                                                                                                                                         | `114514`  |

Popover is built on top of `@base-ui/react/popover`. It provides an Ant Design compatible API for easy migration.

### usePopoverContext

Returns the imperative popover instance for the current content tree.

```ts
type PopoverContextValue = {
  close: () => void;
};
```

### PopoverGroup

| Property                       | Description                                                                                        | Type                                                                              | Default |
| ------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------- |
| children                       | Popover subtree that shares a single popover instance                                              | `ReactNode`                                                                       | -       |
| contentLayoutAnimation         | Animate content layout when switching triggers                                                     | `boolean`                                                                         | `false` |
| disableDestroyOnInvalidTrigger | Disable auto-destroy when the active trigger becomes invalid (e.g. disconnected / `display: none`) | `boolean`                                                                         | `false` |
| disableZeroOriginGuard         | Disable the visual guard that hides the popup when it falls back to viewport (0,0)                 | `boolean`                                                                         | `false` |
| ...props                       | Shared popover props applied to each group member                                                  | `Omit<PopoverProps, 'children' \| 'defaultOpen' \| 'open' \| 'ref' \| 'content'>` | -       |
