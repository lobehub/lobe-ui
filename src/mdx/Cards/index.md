---
nav: Mdx
group: Built-ins
title: Cards
description: A container component for displaying a collection of cards in an MDX document.
atomId: 'Cards, Card'
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Cards/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Cards/index.tsx'
---

## Example

<code src="./demos/index.tsx" ></code>

## Rows

<code src="./demos/Rows.tsx" ></code>

## APIs

### Cards

| Property  | Description                    | Type            | Default |
| --------- | ------------------------------ | --------------- | ------- |
| children  | The Card components to display | `ReactNode[]`   | -       |
| className | Additional CSS class           | `string`        | -       |
| style     | Additional styles              | `CSSProperties` | -       |

### Card

| Property  | Description                   | Type                               | Default    |
| --------- | ----------------------------- | ---------------------------------- | ---------- |
| title     | Title of the card             | `string`                           | -          |
| desc      | Description text              | `string`                           | -          |
| href      | Link URL when card is clicked | `string`                           | -          |
| image     | URL of an image to display    | `string`                           | -          |
| icon      | Icon to display               | `IconProps['icon']`                | -          |
| iconProps | Additional props for the icon | `Omit<IconProps, 'icon'>`          | -          |
| tag       | Tag text to display           | `string`                           | -          |
| tagColor  | Color of the tag              | `TagProps['color']`                | `'blue'`   |
| variant   | Visual style variant          | `'filled' \| other Block variants` | `'filled'` |
| className | Additional CSS class          | `string`                           | -          |
| style     | Additional styles             | `CSSProperties`                    | -          |
