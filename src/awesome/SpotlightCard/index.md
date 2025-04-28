---
nav: Awesome
group: Data Display
title: SpotlightCard
description: SpotlightCard displays a grid of items with an interactive spotlight effect that follows the mouse cursor over each card.
apiHeader:
  pkg: '@lobehub/ui/awesome'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/SpotlightCard/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/SpotlightCard/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property     | Description                            | Type                       | Default |
| ------------ | -------------------------------------- | -------------------------- | ------- |
| items        | Array of items to be displayed         | `any[]`                    | -       |
| renderItem   | Function to render each item           | `(item: any) => ReactNode` | -       |
| columns      | Number of columns in the grid          | `number`                   | `3`     |
| gap          | Gap between grid items                 | `number \| string`         | `'1em'` |
| size         | Size of the spotlight effect           | `number`                   | `800`   |
| borderRadius | Border radius of the cards             | `number`                   | `12`    |
| spotlight    | Whether to enable the spotlight effect | `boolean`                  | `true`  |
| maxItemWidth | Maximum width of each item             | `string \| number`         | -       |

> SpotlightCard also inherits all div element properties
