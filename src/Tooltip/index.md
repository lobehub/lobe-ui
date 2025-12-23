---
nav: Components
group: Data Display
title: Tooltip
description: The Tooltip component is used to provide additional information to the user when they hover over a specific element.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Tooltip Group (Singleton)

Wrap multiple tooltips in `TooltipGroup` to share a single floating instance. When you hover/focus different triggers, the tooltip only updates the anchor + content, reducing per-tooltip overhead.

<code src="./demos/group.tsx" nopadding></code>

## Tooltip Group Shared Props

<code src="./demos/group-shared.tsx" nopadding></code>

## Tooltip Group Trigger Removal

<code src="./demos/group-remove-trigger.tsx" nopadding></code>

## APIs

### Tooltip

| Property        | Description                                                        | Type                                                      | Default |
| --------------- | ------------------------------------------------------------------ | --------------------------------------------------------- | ------- |
| title           | Content of the tooltip                                             | `ReactNode`                                               | -       |
| hotkey          | Keyboard shortcut to display in the tooltip                        | `string`                                                  | -       |
| hotkeyProps     | Props for the Hotkey component                                     | `Omit<HotkeyProps, 'keys'>`                               | -       |
| arrow           | Whether the tooltip has an arrow pointer                           | `boolean`                                                 | `false` |
| placement       | Position of the tooltip                                            | `Floating UI Placement \| 'topLeft' \| ... (AntD legacy)` | `'top'` |
| openDelay       | Delay before opening (ms). Takes precedence over `mouseEnterDelay` | `number`                                                  | `400`   |
| closeDelay      | Delay before closing (ms). Takes precedence over `mouseLeaveDelay` | `number`                                                  | `100`   |
| mouseEnterDelay | Delay before opening (seconds, AntD compatible)                    | `number`                                                  | `0`     |
| mouseLeaveDelay | Delay before closing (seconds, AntD compatible)                    | `number`                                                  | `0`     |

Tooltip is built on top of `@floating-ui/react` (Base Tooltip). For compatibility, it keeps a subset of Ant Design Tooltip-like props (e.g. `mouseEnterDelay`, `mouseLeaveDelay`, legacy `placement` values, and `styles/classNames`).

### TooltipGroup

| Property | Description                                           | Type                                                                            | Default |
| -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- | ------- |
| children | Tooltip subtree that shares a single tooltip instance | `ReactNode`                                                                     | -       |
| ...props | Shared tooltip props applied to each group member     | `Omit<TooltipProps, 'children' \| 'defaultOpen' \| 'open' \| 'ref' \| 'title'>` | -       |

#### Hotkey Support

The Tooltip component includes special integration with the Hotkey component. When you provide a `hotkey` prop, the tooltip will display the specified keyboard shortcut alongside the tooltip text. This is useful for displaying shortcuts for actions.

Example:

```tsx
import { Button, Tooltip } from '@lobehub/ui';

export default () => (
  <Tooltip title="Search" hotkey="mod+k">
    <Button>Search</Button>
  </Tooltip>
);
```

This will display "Search" along with the keyboard shortcut in the tooltip.
