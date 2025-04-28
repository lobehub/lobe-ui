---
nav: Components
group: Data Entry
title: HotkeyInput
description: HotkeyInput is a specialized input component for capturing keyboard shortcuts. It allows users to record key combinations by pressing keys, with visual feedback and validation.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### HotkeyInput

| Property        | Description                                    | Type                                                                  | Default                           |
| --------------- | ---------------------------------------------- | --------------------------------------------------------------------- | --------------------------------- |
| value           | Current value of the shortcut                  | `string`                                                              | `''`                              |
| defaultValue    | Default value of the shortcut                  | `string`                                                              | `''`                              |
| resetValue      | Value to reset to when reset button is clicked | `string`                                                              | `''`                              |
| onChange        | Callback when shortcut changes                 | `(value: string) => void`                                             | -                                 |
| onConflict      | Callback when a conflict is detected           | `(conflictKey: string) => void`                                       | -                                 |
| onReset         | Callback when shortcut is reset                | `(currentValue: string, resetValue: string) => void`                  | -                                 |
| placeholder     | Placeholder text when no shortcut is entered   | `string`                                                              | `'Press keys to record shortcut'` |
| disabled        | Whether the input is disabled                  | `boolean`                                                             | `false`                           |
| allowReset      | Whether to show the reset button               | `boolean`                                                             | `true`                            |
| shadow          | Add shadow effect to the input                 | `boolean`                                                             | `false`                           |
| hotkeyConflicts | Array of shortcut strings that conflict        | `string[]`                                                            | `[]`                              |
| isApple         | Use Mac-style key icons                        | `boolean`                                                             | Auto-detected                     |
| variant         | Style variant of the input                     | `'filled' \| 'outlined' \| 'borderless'`                              | -                                 |
| texts           | Customization texts                            | `{ conflicts?: string; invalidCombination?: string; reset?: string }` | -                                 |

### Features

1. **Hotkey Recording**: Press keys to record keyboard shortcuts
2. **Validation**: Ensures shortcuts contain valid key combinations
3. **Conflict Detection**: Warns when shortcuts conflict with existing ones
4. **Reset Support**: Allows resetting to default shortcut
5. **Platform Detection**: Automatically adjusts key display based on Mac/Windows

### Key Format

The input and output values use the same format as the Hotkey component, with keys separated by `+` (e.g., `"ctrl+shift+a"`). The component supports both standard keyboard keys and modifier keys.
