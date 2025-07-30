---
nav: Components
group: Data Display
title: GroupAvatar
description: GroupAvatar is a component that displays multiple user avatars in a grid layout with smooth corner styling. It supports different corner types including iOS-style superellipse shapes for modern visual appeal. The component automatically arranges up to 4 avatars in a 2x2 grid and applies smooth corner masks for enhanced visual presentation.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Corner Shape

<code src="./demos/CornerShape.tsx" center></code>

## APIs

### GroupAvatar

| Property    | Description                             | Type                                                                 | Default      |
| ----------- | --------------------------------------- | -------------------------------------------------------------------- | ------------ |
| avatars     | Array of avatar items (URLs or objects) | `AvatarItem[]`                                                       | `[]`         |
| avatarShape | Shape of the avatar                     | `'circle' \| 'square'`                                               | `'circle'`   |
| size        | Size of the group avatar container      | `number`                                                             | `32`         |
| grid        | Grid layout configuration               | `2 \| 3 \| 'auto'`                                                   | `2`          |
| cornerShape | Type of corners to apply                | `'circle' \| 'square' \| 'squircle' \| 'ios' \| 'smooth' \| 'sharp'` | `'squircle'` |
| className   | Custom CSS class name                   | `string`                                                             | -            |
| style       | Custom inline styles                    | `CSSProperties`                                                      | -            |

### AvatarItem

Avatar items can be either:

- **String**: Direct URL to an avatar image
- **Object**: Avatar configuration with the following properties:

| Property   | Description                   | Type                  | Default |
| ---------- | ----------------------------- | --------------------- | ------- |
| avatar     | Avatar content (URL or emoji) | `string \| ReactNode` | -       |
| background | Background color              | `string`              | -       |

### Corner Shape Types

- **`circle`**: Perfect circle shape (50% border radius)
- **`square`**: Rounded square (15% border radius)
- **`squircle`**: Classic squircle shape (n=4) - balanced between square and circle
- **`ios`**: iOS-style corners (n=5) - used in Apple icons since iOS 7
- **`smooth`**: Extra smooth corners (n=3) - more rounded appearance
- **`sharp`**: Sharp corners (n=6) - subtle rounding, closer to rectangle

### Grid Layout

The `grid` property controls how avatars are arranged in the group:

- **`2`**: 2x2 grid layout (displays up to 4 avatars)
- **`3`**: 3x3 grid layout (displays up to 9 avatars)
- **`'auto'`**: Automatically determines grid size based on avatar count
  - Uses 2x2 grid for 4 or fewer avatars
  - Uses 3x3 grid for more than 4 avatars
