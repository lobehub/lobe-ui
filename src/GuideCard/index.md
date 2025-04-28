---
nav: Components
group: Data Display
title: GuideCard
description: GuideCard is a component used to display visual guides, introductory content, or instructional information with an optional cover image, title, and description. It supports various visual styles, closable functionality, and customization options.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property       | Description                               | Type                                                  | Default |
| -------------- | ----------------------------------------- | ----------------------------------------------------- | ------- |
| title          | Title content                             | `ReactNode`                                           | -       |
| desc           | Description content                       | `ReactNode`                                           | -       |
| cover          | URL of the cover image                    | `string`                                              | -       |
| alt            | Alt text for the cover image              | `string`                                              | -       |
| closable       | Whether the card can be closed            | `boolean`                                             | `false` |
| onClose        | Callback when the close button is clicked | `(e: MouseEvent) => void`                             | -       |
| afterClose     | Callback after the card is closed         | `() => void`                                          | -       |
| closeIconProps | Props for the close icon button           | `Omit<ActionIconProps, 'icon' \| 'onClick'>`          | -       |
| variant        | Visual style variant                      | `'filled' \| 'outlined' \| 'borderless'`              | -       |
| shadow         | Whether to display shadow                 | `boolean`                                             | `false` |
| width          | Width of the card                         | `number`                                              | -       |
| height         | Height of the card                        | `number`                                              | -       |
| coverProps     | Props for the cover image component       | `ImgProps & ImageProps & { priority?: boolean }`      | -       |
| classNames     | Custom class names                        | `{ content?: string; cover?: string; }`               | -       |
| styles         | Custom styles                             | `{ content?: CSSProperties; cover?: CSSProperties; }` | -       |

> Additional props are inherited from `FlexboxProps` from the react-layout-kit library.
