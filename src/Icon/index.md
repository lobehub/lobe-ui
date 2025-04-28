---
nav: Components
group: General
title: Icon
description: Icon is a component based on lucide-react that provides rich icon selection and customization options. It supports various sizes, colors, and animations.
---

## Introduction

Icon is a reusable React component for rendering SVG icons from the `lucide-react` library. It provides a simple yet powerful API to customize the appearance and behavior of icons.

## Basic Usage

Search for available icons in [`Lucide Icon`](https://lucide.dev/)

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Icon

| Property    | Description                               | Type                                       | Default         |
| ----------- | ----------------------------------------- | ------------------------------------------ | --------------- |
| icon        | Icon component from Lucide or custom icon | `LucideIcon \| FC<any> \| ReactNode`       | -               |
| size        | Size of the icon                          | `number \| IconSizeType \| IconSizeConfig` | -               |
| color       | Color of the icon                         | `string`                                   | -               |
| fill        | Fill color of the icon                    | `string`                                   | `'transparent'` |
| fillOpacity | Opacity of the fill                       | `number \| string`                         | -               |
| fillRule    | Fill rule for SVG                         | `'nonzero' \| 'evenodd' \| 'inherit'`      | -               |
| focusable   | Whether the icon is focusable             | `boolean`                                  | -               |
| spin        | Whether the icon should spin              | `boolean`                                  | `false`         |
| strokeWidth | Width of the stroke                       | `number \| string`                         | `2`             |

Icon also inherits all properties from the standard HTML span element, and most properties from Lucide icons.

### IconSizeType

The component accepts predefined size options:

| Size     | Description           | Actual Size | Stroke Width |
| -------- | --------------------- | ----------- | ------------ |
| `small`  | Small icon            | 14px        | 2px          |
| `middle` | Medium icon (default) | 20px        | 2px          |
| `large`  | Large icon            | 24px        | 2px          |

### IconSizeConfig

For more fine-grained control, you can provide a configuration object:

| Property            | Description                      | Type               | Default |
| ------------------- | -------------------------------- | ------------------ | ------- |
| size                | Size of the icon                 | `number \| string` | `24`    |
| strokeWidth         | Width of the stroke              | `number \| string` | `2`     |
| absoluteStrokeWidth | Whether stroke width is absolute | `boolean`          | -       |

### IconProvider

The Icon component can be wrapped with IconProvider to set default properties for all icons within its scope:

```tsx
import { Icon, IconProvider } from '@lobehub/ui';
import { PlusCircle, Settings } from 'lucide-react';

export default () => (
  <IconProvider config={{ color: 'red', size: 'large' }}>
    <Icon icon={PlusCircle} />
    <Icon icon={Settings} />
  </IconProvider>
);
```
