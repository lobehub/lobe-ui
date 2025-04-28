---
nav: Components
group: Data Display
title: Avatar
description: Avatar is a component that displays a user's profile picture or initials. It can be customized with props like size, shape, background color, and image source. If no image source is provided, it will display the user's initials. This component is typically used in user profile pages, comment sections, or messaging applications.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Text

<code src="./demos/Text.tsx" center></code>

## Bordered

<code src="./demos/Bordered.tsx" center></code>

## Group

<code src="./demos/Group.tsx" nopadding></code>

## APIs

### Avatar

| Property      | Description                                       | Type                                     | Default        |
| ------------- | ------------------------------------------------- | ---------------------------------------- | -------------- |
| animation     | Enable animation for emoji avatars                | `boolean`                                | `false`        |
| avatar        | Content of the avatar (image URL, emoji, or Node) | `string \| ReactNode`                    | -              |
| background    | Background color of the avatar                    | `string`                                 | -              |
| bordered      | Whether to show a border                          | `boolean`                                | `false`        |
| borderedColor | Color of the border                               | `string`                                 | -              |
| loading       | Show loading state                                | `boolean`                                | `false`        |
| shadow        | Whether to show shadow                            | `boolean`                                | `false`        |
| shape         | Shape of the avatar                               | `'circle' \| 'square'`                   | `'circle'`     |
| size          | Size of the avatar                                | `number`                                 | `48`           |
| sliceText     | Whether to slice text to 2 characters             | `boolean`                                | `true`         |
| title         | Title for tooltip                                 | `string`                                 | -              |
| tooltipProps  | Props for tooltip                                 | `Omit<TooltipProps, 'title'>`            | -              |
| unoptimized   | Disable image optimization for Next.js            | `boolean`                                | `false`        |
| variant       | Style variant                                     | `'borderless' \| 'filled' \| 'outlined'` | `'borderless'` |

### Avatar.Group

| Property   | Description                        | Type                                                          | Default        |
| ---------- | ---------------------------------- | ------------------------------------------------------------- | -------------- |
| animation  | Enable animation for emoji avatars | `boolean`                                                     | `false`        |
| background | Background color of avatars        | `string`                                                      | -              |
| bordered   | Whether to show borders            | `boolean`                                                     | `false`        |
| classNames | Custom class names                 | `{ avatar?: string; count?: string }`                         | -              |
| gap        | Gap between avatars                | `number`                                                      | -size/4        |
| items      | Array of avatar items              | `AvatarGroupItemType[]`                                       | -              |
| max        | Maximum number of avatars to show  | `number`                                                      | -              |
| onClick    | Click handler for avatar           | `(props: { item: AvatarGroupItemType; key: string }) => void` | -              |
| shadow     | Whether to show shadows            | `boolean`                                                     | `false`        |
| shape      | Shape of avatars                   | `'circle' \| 'square'`                                        | `'circle'`     |
| size       | Size of avatars                    | `number`                                                      | `48`           |
| styles     | Custom styles                      | `{ avatar?: CSSProperties; count?: CSSProperties }`           | -              |
| variant    | Style variant                      | `'borderless' \| 'filled' \| 'outlined'`                      | `'borderless'` |

### AvatarGroupItemType

| Property | Description                | Type                      |
| -------- | -------------------------- | ------------------------- |
| avatar   | Avatar content             | `string \| ReactNode`     |
| key      | Unique identifier          | `string`                  |
| title    | Title for tooltip          | `string`                  |
| alt      | Alternative text for image | `string`                  |
| loading  | Show loading state         | `boolean`                 |
| onClick  | Click handler for avatar   | `(e: MouseEvent) => void` |
