---
nav: Components
group: Data Display
title: Hotkey
description: Hotkey component displays keyboard shortcuts or key combinations in a visually appealing way, supporting both standard and Mac keyboard styles with various visual options.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Mac Style

<code src="./demos/MacStyle.tsx" nopadding></code>

## Mouse

<code src="./demos/Mouse.tsx" center></code>

## InverseTheme

<code src="./demos/InverseTheme.tsx" center></code>

## APIs

### Hotkey

| Property     | Description                       | Type                                     | Default       |
| ------------ | --------------------------------- | ---------------------------------------- | ------------- |
| keys         | Key combination to display        | `string`                                 | -             |
| compact      | Display all keys in a single pill | `boolean`                                | `false`       |
| inverseTheme | Invert the theme colors           | `boolean`                                | `false`       |
| isApple      | Use Mac-style key icons           | `boolean`                                | Auto-detected |
| variant      | Style variant                     | `'filled' \| 'outlined' \| 'borderless'` | `'filled'`    |
| classNames   | Custom class names                | `{ kbdClassName?: string }`              | -             |
| styles       | Custom styles                     | `{ kbdStyle?: CSSProperties }`           | -             |

Additionally, Hotkey accepts all properties from the Flexbox component except for 'children'.

### Key Format

The `keys` prop should be a string with keys separated by `+`. For example:

```tsx
import { Hotkey } from '@lobehub/ui';

export default () => {
  return (
    <>
      <Hotkey keys="shift+a" />
      <Hotkey keys="ctrl+alt+delete" />
      <Hotkey keys="mod+k" />
    </>
  );
};
```

> 'mod' will be Command on Mac and Ctrl on Windows

### KeyMapEnum

For convenience, common keys are available as constants via the exported `KeyMapEnum` object:

```tsx
import { Hotkey, KeyMapEnum } from '@lobehub/ui';

export default () => {
  return (
    <>
      <Hotkey keys={KeyMapEnum.LeftClick} />
      <Hotkey keys={`${KeyMapEnum.Shift}+${KeyMapEnum.Alt}+r`} />
    </>
  );
};
```

Some notable keys in KeyMapEnum:

| Key                           | Description                            |
| ----------------------------- | -------------------------------------- |
| `Alt`                         | Alt key                                |
| `Ctrl`                        | Control key                            |
| `CommandOrControl`            | Command on Mac, Control on Windows     |
| `Shift`                       | Shift key                              |
| `Mod`                         | Command on Mac, Control on Windows     |
| `Meta`                        | Command on Mac, Windows key on Windows |
| `Enter`                       | Enter/Return key                       |
| `Space`                       | Space bar                              |
| `LeftClick`                   | Left mouse button click                |
| `RightClick`                  | Right mouse button click               |
| `MiddleClick`                 | Middle mouse button click              |
| `LeftDoubleClick`             | Left mouse button double click         |
| `Up`, `Down`, `Left`, `Right` | Arrow keys                             |
