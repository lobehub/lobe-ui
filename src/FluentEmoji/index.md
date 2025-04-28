---
nav: Components
group: Data Display
title: FluentEmoji
description: The FluentEmoji component is used to display an emoji with the Fluent design style. It supports different types of styles (modern, flat, high-contrast) and sizes. It also provides a loading spinner when the image is being fetched from the server, and a fallback text emoji when the image fails to load. The component is customizable with className and style props, and can receive additional props to be passed down to the underlying div element.
---

## Default

Find details in <https://fluent-emoji.lobehub.com>

<code src="./demos/index.tsx" nopadding></code>

## APIs

### FluentEmoji

| Property    | Description                            | Type                                                      | Default |
| ----------- | -------------------------------------- | --------------------------------------------------------- | ------- |
| emoji       | The emoji character or shortcode       | `string`                                                  | -       |
| size        | Size of the emoji in pixels            | `number`                                                  | `40`    |
| type        | Style type of the emoji                | `'anim' \| 'flat' \| 'modern' \| 'mono' \| 'raw' \| '3d'` | `'3d'`  |
| unoptimized | Disable image optimization for Next.js | `boolean`                                                 | `false` |

Additionally, the component accepts all standard HTML div properties like `className`, `style`, etc.

#### Emoji Types

- `3d`: Three-dimensional style with shadows and depth
- `anim`: Animated emoji (works with certain emojis)
- `flat`: Flat design style
- `modern`: Modern design style with subtle gradients
- `mono`: Monochrome/outline style
- `raw`: Displays the native emoji character from the system font
