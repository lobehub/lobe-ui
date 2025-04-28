---
nav: Components
group: Data Display
title: Tooltip
description: The Tooltip component is used to provide additional information to the user when they hover over a specific element.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Tooltip

| Property    | Description                                 | Type                                                         | Default |
| ----------- | ------------------------------------------- | ------------------------------------------------------------ | ------- |
| title       | Content of the tooltip                      | `ReactNode`                                                  | -       |
| hotkey      | Keyboard shortcut to display in the tooltip | `string`                                                     | -       |
| hotkeyProps | Props for the Hotkey component              | `Omit<HotkeyProps, 'keys'>`                                  | -       |
| arrow       | Whether the tooltip has an arrow pointer    | `boolean`                                                    | `false` |
| placement   | Position of the tooltip                     | `'top' \| 'left' \| 'right' \| 'bottom' \| 'topLeft' \| ...` | `'top'` |

In addition to the above properties, Tooltip inherits all properties from Ant Design's Tooltip component (except for 'title', which has been enhanced to support hotkeys).

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
