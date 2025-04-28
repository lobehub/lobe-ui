---
nav: Awesome
group: Effect
title: GridBackground
description: GridBackground creates a dynamic grid pattern background with customizable colors and animation effects.
apiHeader:
  pkg: '@lobehub/ui/awesome'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/GridBackground/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/GridBackground/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Showcase

<code src="./demos/Showcase.tsx" center></code>

## APIs

### GridBackground

| Property          | Description                           | Type      | Default |
| ----------------- | ------------------------------------- | --------- | ------- |
| animation         | Whether to animate the grid           | `boolean` | -       |
| animationDuration | Duration of the animation in seconds  | `number`  | -       |
| backgroundColor   | Background color behind the grid      | `string`  | -       |
| colorBack         | Color of the back grid lines          | `string`  | -       |
| colorFront        | Color of the front grid lines         | `string`  | -       |
| flip              | Whether to flip the grid orientation  | `boolean` | -       |
| random            | Whether to randomize the grid pattern | `boolean` | -       |
| reverse           | Whether to reverse the grid direction | `boolean` | -       |
| showBackground    | Whether to show the background color  | `boolean` | -       |
| strokeWidth       | Width of the grid lines               | `number`  | -       |

### GridShowcase

| Property        | Description                   | Type           | Default |
| --------------- | ----------------------------- | -------------- | ------- |
| backgroundColor | Background color              | `string`       | -       |
| innerProps      | Props for the inner container | `FlexboxProps` | -       |

> GridBackground inherits all div element properties
> GridShowcase inherits all Flexbox properties
