---
nav: Components
group:
  title: General
  order: -1
title: ActionIcon
description: ActionIcon is a component for rendering icon buttons with background, supporting multiple style variants, sizes, and interaction states. It integrates with the Lucide icon library and provides tooltip capabilities.
---

## Introduction

ActionIcon is a powerful icon button component based on the Lucide icon library, offering rich styling and interaction options. It's particularly suitable for toolbars, action buttons, and similar UI elements.

## Basic Usage

Search icons in [`Lucide Icon`](https://lucide.dev/)

<code src="./demos/index.tsx" nopadding></code>

## Size

### Preset Sizes

ActionIcon provides multiple preset size options, including `small`, `normal`, `large`, and more.

<code src="./demos/Size.tsx" center></code>

### Custom Size

You can customize the icon size by passing a number or configuration object.

<code src="./demos/CustomSize.tsx" nopadding></code>

## Variants

ActionIcon supports multiple style variants, including default, filled, outlined, and dashed styles.

<code src="./demos/Variant.tsx" center></code>

## APIs

### ActionIcon

| Property     | Description                        | Type                                                               | Default        |
| ------------ | ---------------------------------- | ------------------------------------------------------------------ | -------------- |
| active       | Set button active state            | `boolean`                                                          | `false`        |
| danger       | Set button danger style            | `boolean`                                                          | `false`        |
| disabled     | Disable the button                 | `boolean`                                                          | `false`        |
| glass        | Apply glass style effect           | `boolean`                                                          | `false`        |
| icon         | Icon component or Lucide icon name | `IconProps['icon'] \| ReactNode`                                   | -              |
| loading      | Display loading state              | `boolean`                                                          | `false`        |
| shadow       | Add shadow effect                  | `boolean`                                                          | `false`        |
| size         | Set icon size                      | `number \| 'small' \| 'middle' \| 'large' \| ActionIconSizeConfig` | `'middle'`     |
| spin         | Animate icon with spinning motion  | `boolean`                                                          | `false`        |
| title        | Tooltip text                       | `ReactNode`                                                        | -              |
| tooltipProps | Additional tooltip properties      | `Partial<TooltipProps>`                                            | -              |
| variant      | Style variant                      | `'borderless' \| 'filled' \| 'outlined'`                           | `'borderless'` |
| color        | Icon color                         | `string`                                                           | -              |
| fill         | Icon fill color                    | `string`                                                           | -              |
| onClick      | Click event handler                | `MouseEventHandler<HTMLDivElement>`                                | -              |

### ActionIconSizeConfig

| Property     | Description                 | Type               |
| ------------ | --------------------------- | ------------------ |
| blockSize    | Set button width and height | `number \| string` |
| borderRadius | Set button border radius    | `number \| string` |
