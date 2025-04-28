---
nav: Components
group:
  title: General
  order: -1
title: Button
description: Button is a powerful component that supports multiple style variants, sizes, and interaction states. It extends Ant Design's Button with enhanced styling and icon support.
---

## Introduction

Button is a fundamental component that provides rich styling and interaction options. It's suitable for various button interaction scenarios.

## Basic Usage

<code src="./demos/index.tsx" nopadding></code>

## Variants

Button supports multiple style variants, including default, filled, outlined, and dashed styles.

<code src="./demos/Variant.tsx"></code>

## APIs

### Button

| Property  | Description                        | Type                                                     | Default                                              |
| --------- | ---------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| glass     | Apply glass effect to button       | `boolean`                                                | `false`                                              |
| icon      | Icon component or Lucide icon name | `IconProps['icon']`                                      | -                                                    |
| iconProps | Properties for the icon component  | `Partial<Omit<IconProps, 'icon'>>`                       | -                                                    |
| shadow    | Add shadow effect to button        | `boolean`                                                | `false`                                              |
| variant   | Style variant                      | `'filled' \| 'outlined' \| 'dashed' \| 'text' \| 'link'` | `'outlined'` (light mode)<br/>`'filled'` (dark mode) |

Additionally, Button supports all properties from Ant Design's Button component except `icon`, which has been replaced with a more flexible implementation.
