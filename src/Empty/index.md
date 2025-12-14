---
nav: Components
group: Data Display
title: Empty
description: Empty component displays an empty state with customizable icon, emoji, image, title, description, and action buttons. It's commonly used to indicate that there's no data or content to display.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## With Icon

<code src="./demos/WithIcon.tsx" nopadding></code>

## With Emoji

<code src="./demos/WithEmoji.tsx" nopadding></code>

## With Action Button

<code src="./demos/WithAction.tsx" nopadding></code>

## APIs

### Empty

| Property         | Description                              | Type                           | Default |
| ---------------- | ---------------------------------------- | ------------------------------ | ------- |
| action           | Action button or element to display      | `ReactNode`                    | -       |
| children         | Additional content to display            | `ReactNode`                    | -       |
| description      | Description text below the title         | `ReactNode`                    | -       |
| descriptionProps | Props for the description Text component | `Omit<TextProps, 'children'>`  | -       |
| emoji            | Emoji to display in the image area       | `string`                       | -       |
| icon             | Icon to display in the image area        | `IconProps['icon']`            | -       |
| image            | Custom image or element to display       | `ReactNode`                    | -       |
| imageProps       | Props for the image Block component      | `Omit<BlockProps, 'children'>` | -       |
| imageSize        | Size of the image/icon/emoji area        | `number`                       | `48`    |
| title            | Title text to display                    | `ReactNode`                    | -       |
| titleProps       | Props for the title Text component       | `Omit<TextProps, 'children'>`  | -       |

> Empty component inherits all properties from [Flexbox](https://github.com/ant-design/react-layout-kit)
