---
nav: Components
group: Data Entry
title: ColorSwatches
---

ColorSwatches is a component for displaying and selecting colors. It provides a set of predefined color swatches and optionally a color picker for custom colors.

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property            | Description                                      | Type                                  | Default    |
| ------------------- | ------------------------------------------------ | ------------------------------------- | ---------- |
| colors              | Array of color objects to display                | `ColorSwatchesItemType[]`             | -          |
| defaultValue        | Default selected color                           | `string`                              | -          |
| value               | Currently selected color                         | `string`                              | -          |
| onChange            | Callback when a color is selected                | `(color?: string) => void`            | -          |
| enableColorSwatches | Whether to show color swatches                   | `boolean`                             | `true`     |
| enableColorPicker   | Whether to show a color picker for custom colors | `boolean`                             | -          |
| size                | Size of the color swatches                       | `number`                              | `24`       |
| shape               | Shape of the color swatches                      | `'circle' \| 'square'`                | `'circle'` |
| texts               | Custom texts for color picker                    | `{ custom: string; presets: string }` | -          |

### ColorSwatchesItemType

| Property | Description                      | Type        | Default |
| -------- | -------------------------------- | ----------- | ------- |
| color    | The color value (hex, rgb, etc.) | `string`    | -       |
| key      | Unique identifier                | `Key`       | -       |
| title    | Tooltip text for the color       | `ReactNode` | -       |

> ColorSwatches also inherits properties from Flexbox component except for 'onChange'
