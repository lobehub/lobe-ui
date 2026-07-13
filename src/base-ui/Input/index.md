---
nav: Components
group: Data Entry
title: Input
description: Base UI-powered Input and TextArea components.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Input/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Input/Input.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Password / Number / OTP

<code src="./demos/family.tsx" nopadding></code>

## APIs

### Input

| Property   | Description                                           | Type                                     | Default                           |
| ---------- | ----------------------------------------------------- | ---------------------------------------- | --------------------------------- |
| variant    | Visual variant                                        | `'filled' \| 'outlined' \| 'borderless'` | dark: `filled`, light: `outlined` |
| size       | Control height                                        | `'small' \| 'middle' \| 'large'`         | `middle`                          |
| shadow     | Apply lobe shadow style                               | `boolean`                                | `false`                           |
| prefix     | Node rendered before the input                        | `ReactNode`                              | -                                 |
| suffix     | Node rendered after the input                         | `ReactNode`                              | -                                 |
| classNames | Class names for parts (`input` / `prefix` / `suffix`) | `InputClassNames`                        | -                                 |
| styles     | Styles for parts (`input` / `prefix` / `suffix`)      | `InputStyles`                            | -                                 |

Remaining props are forwarded to the underlying Base UI `Input` (`onValueChange`, `defaultValue`, native input attributes, etc.). It automatically integrates with `Field` / `Form` validation.

### InputPassword

Extends Input; `visibilityToggle` (default `true`) renders the eye button.

### InputNumber

Wraps Base UI `NumberField`: `value` / `defaultValue` / `onChange(value: number | null)`, `min` / `max` / `step`, `controls` (default `true`), `changeOnWheel`, plus `variant` / `size` / `shadow`.

### InputOTP

Wraps Base UI `OTPField`: `length` (default `6`), `value` / `defaultValue` / `onChange(value: string)`, `mask`, `autoSubmit`, plus `variant` / `size` / `shadow`.

### TextArea

| Property | Description                                        | Type                                                | Default                           |
| -------- | -------------------------------------------------- | --------------------------------------------------- | --------------------------------- |
| autoSize | Auto grow with content, optionally bounded by rows | `boolean \| { minRows?: number; maxRows?: number }` | -                                 |
| resize   | Allow manual vertical resize                       | `boolean`                                           | `false`                           |
| variant  | Visual variant                                     | `'filled' \| 'outlined' \| 'borderless'`            | dark: `filled`, light: `outlined` |
| shadow   | Apply lobe shadow style                            | `boolean`                                           | `false`                           |
