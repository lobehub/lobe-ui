---
nav: Components
group: Data Entry
title: ImageSelect
description: ImageSelect allows users to choose an option from a list of images. It's ideal for visual selection interfaces where images better represent options than text.
---

## Default

<code src="./demos/index.tsx" center></code>

## APIs

### ImageSelect

| Property     | Description                            | Type                      | Default |
| ------------ | -------------------------------------- | ------------------------- | ------- |
| value        | Currently selected value               | `string`                  | -       |
| defaultValue | Default selected value                 | `string`                  | -       |
| options      | Array of image options                 | `ImageSelectItem[]`       | -       |
| onChange     | Callback when selection changes        | `(value: string) => void` | -       |
| width        | Width of each image                    | `number`                  | `144`   |
| height       | Height of each image                   | `number`                  | `86`    |
| unoptimized  | Disable image optimization for Next.js | `boolean`                 | `false` |
| classNames   | Custom class names                     | `{ img?: string }`        | -       |
| styles       | Custom styles                          | `{ img?: CSSProperties }` | -       |

Additionally, ImageSelect accepts all properties from Flexbox component.

### ImageSelectItem

| Property | Description                      | Type                | Default |
| -------- | -------------------------------- | ------------------- | ------- |
| value    | Unique identifier for the option | `string`            | -       |
| label    | Display text for the option      | `ReactNode`         | -       |
| img      | Image URL                        | `string`            | -       |
| icon     | Optional icon to display         | `IconProps['icon']` | -       |
| alt      | Alternative text for the image   | `string`            | -       |
