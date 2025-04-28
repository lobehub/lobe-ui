---
nav: Components
group: Data Entry
title: SliderWithInput
description: SliderWithInput combines a slider with an input number field, allowing users to adjust values either by dragging the slider or entering a precise number in the input field.
---

## Default

<code src="./demos/index.tsx" center></code>

## APIs

| Property     | Description                              | Type                                                | Default |
| ------------ | ---------------------------------------- | --------------------------------------------------- | ------- |
| value        | Current value                            | `number`                                            | -       |
| defaultValue | Default value                            | `number`                                            | -       |
| min          | Minimum value                            | `number`                                            | -       |
| max          | Maximum value                            | `number`                                            | -       |
| step         | Value step for slider and input          | `number`                                            | -       |
| size         | Size of the input field                  | `'small' \| 'middle' \| 'large'`                    | -       |
| controls     | Whether to show number controls in input | `boolean`                                           | -       |
| gap          | Space between slider and input           | `number`                                            | `16`    |
| disabled     | Whether component is disabled            | `boolean`                                           | -       |
| styles       | Custom styles for components             | `{ input?: CSSProperties; slider?: CSSProperties }` | -       |
| classNames   | Custom class names for components        | `{ input?: string; slider?: string }`               | -       |
