---
nav: Components
group: Data Entry
title: Slider
description: Base UI-powered Slider and SliderWithInput components.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Slider/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Slider/Slider.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Slider

| Property         | Description                       | Type                      | Default     |
| ---------------- | --------------------------------- | ------------------------- | ----------- |
| value            | Controlled value                  | `number`                  | -           |
| defaultValue     | Uncontrolled initial value        | `number`                  | -           |
| onChange         | Fires while dragging              | `(value: number) => void` | -           |
| onChangeComplete | Fires when the value is committed | `(value: number) => void` | -           |
| min / max / step | Range constraints                 | `number`                  | 0 / 100 / 1 |
| disabled         | Disable interaction               | `boolean`                 | -           |
| name             | Form field name                   | `string`                  | -           |

### SliderWithInput

Extends Slider, plus:

| Property       | Description                    | Type                                     | Default                       |
| -------------- | ------------------------------ | ---------------------------------------- | ----------------------------- |
| size           | InputNumber size               | `'small' \| 'middle' \| 'large'`         | `middle`                      |
| controls       | Show InputNumber steppers      | `boolean`                                | `true` (forced off for small) |
| unlimitedInput | Don't clamp the input to `max` | `boolean`                                | `false`                       |
| changeOnWheel  | Wheel scrub on the input       | `boolean`                                | -                             |
| gap            | Gap between slider and input   | `number \| string`                       | `16`                          |
| variant        | InputNumber variant            | `'filled' \| 'outlined' \| 'borderless'` | auto                          |
