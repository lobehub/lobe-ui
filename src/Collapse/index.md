---
nav: Components
group: Data Display
title: Collapse
---

Collapse is a content container that can be expanded or collapsed. It extends Ant Design's Collapse with additional styling options and features like icons and descriptions in headers.

## Default

<code src="./demos/index.tsx" nopadding></code>

## Custom Padding

<code src="./demos/Padding.tsx" center></code>

## APIs

| Property    | Description                          | Type                                                                         | Default    |
| ----------- | ------------------------------------ | ---------------------------------------------------------------------------- | ---------- |
| variant     | The style variant of the collapse    | `'filled' \| 'outlined' \| 'borderless'`                                     | `'filled'` |
| items       | Array of items to be displayed       | `CollapseItemType[]`                                                         | -          |
| gap         | Gap between collapse panels          | `number`                                                                     | `0`        |
| collapsible | Whether the panel is collapsible     | `boolean`                                                                    | `true`     |
| padding     | Padding of the header and content    | `number \| string \| { body?: number \| string; header?: number \| string }` | -          |
| classNames  | Custom classNames for child elements | `{ desc?: string; header?: string; title?: string }`                         | -          |
| styles      | Custom styles for child elements     | `{ desc?: CSSProperties; header?: CSSProperties; title?: CSSProperties }`    | -          |

### CollapseItemType

| Property | Description                      | Type                | Default |
| -------- | -------------------------------- | ------------------- | ------- |
| key      | Unique identifier of the panel   | `string \| number`  | -       |
| label    | Title of the panel               | `ReactNode`         | -       |
| desc     | Description text below the title | `ReactNode`         | -       |
| icon     | Icon displayed before the title  | `IconProps['icon']` | -       |
| children | Content of the panel             | `ReactNode`         | -       |

> More API properties are inherited from [Ant Design Collapse](https://ant.design/components/collapse)
