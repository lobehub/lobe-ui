---
nav: Components
group: Data Display
title: Skeleton
description: Skeleton component provides a placeholder loading state for content that is being loaded. It displays animated placeholder blocks that mimic the structure of the actual content, improving user experience during data loading.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## With Avatar

<code src="./demos/WithAvatar.tsx"></code>

## Custom

<code src="./demos/Custom.tsx"></code>

## Avatar

<code src="./demos/Avatar.tsx"></code>

## Block

<code src="./demos/Block.tsx"></code>

## Button

<code src="./demos/Button.tsx"></code>

## Title

<code src="./demos/Title.tsx"></code>

## Paragraph

<code src="./demos/Paragraph.tsx"></code>

## Tags

<code src="./demos/Tags.tsx"></code>

## APIs

### Skeleton

| Property   | Description                                          | Type                                                                                                 | Default |
| ---------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| active     | Show animation effect                                | `boolean`                                                                                            | `true`  |
| avatar     | Show avatar skeleton or configure avatar props       | `SkeletonAvatarProps \| boolean`                                                                     | -       |
| classNames | Custom class names                                   | `{ avatar?: string; paragraph?: string; root?: string; title?: string }`                             | -       |
| height     | Height of the skeleton                               | `number \| string`                                                                                   | -       |
| paragraph  | Show paragraph skeleton or configure paragraph props | `SkeletonParagraphProps \| boolean`                                                                  | `true`  |
| styles     | Custom styles                                        | `{ avatar?: CSSProperties; paragraph?: CSSProperties; root?: CSSProperties; title?: CSSProperties }` | -       |
| title      | Show title skeleton or configure title props         | `SkeletonTitleProps \| boolean`                                                                      | `true`  |
| width      | Width of the skeleton                                | `number \| string`                                                                                   | -       |

### Skeleton.Avatar

| Property | Description           | Type                   | Default    |
| -------- | --------------------- | ---------------------- | ---------- |
| active   | Show animation effect | `boolean`              | `true`     |
| shape    | Shape of the avatar   | `'circle' \| 'square'` | `'circle'` |
| size     | Size of the avatar    | `number \| string`     | `40`       |
| width    | Width of the avatar   | `number \| string`     | -          |
| height   | Height of the avatar  | `number \| string`     | -          |

### Skeleton.Block

| Property | Description           | Type               | Default  |
| -------- | --------------------- | ------------------ | -------- |
| active   | Show animation effect | `boolean`          | -        |
| height   | Height of the block   | `number \| string` | `'1em'`  |
| width    | Width of the block    | `number \| string` | `'100%'` |

### Skeleton.Button

| Property | Description           | Type                               | Default     |
| -------- | --------------------- | ---------------------------------- | ----------- |
| active   | Show animation effect | `boolean`                          | `true`      |
| block    | Fill the parent width | `boolean`                          | `false`     |
| height   | Height of the button  | `number \| string`                 | -           |
| shape    | Shape of the button   | `'circle' \| 'round' \| 'default'` | `'default'` |
| size     | Size of the button    | `'large' \| 'small' \| 'default'`  | `'default'` |
| width    | Width of the button   | `number \| string`                 | -           |

### Skeleton.Title

| Property   | Description           | Type               | Default |
| ---------- | --------------------- | ------------------ | ------- |
| active     | Show animation effect | `boolean`          | `true`  |
| fontSize   | Font size             | `number`           | -       |
| height     | Height of the title   | `number \| string` | -       |
| lineHeight | Line height           | `number`           | -       |
| width      | Width of the title    | `number \| string` | `'60%'` |

### Skeleton.Paragraph

| Property   | Description           | Type                                       | Default |
| ---------- | --------------------- | ------------------------------------------ | ------- |
| active     | Show animation effect | `boolean`                                  | `true`  |
| fontSize   | Font size             | `number`                                   | -       |
| gap        | Gap between rows      | `number`                                   | -       |
| height     | Height of each row    | `number \| string`                         | -       |
| lineHeight | Line height           | `number`                                   | -       |
| rows       | Number of rows        | `number`                                   | `3`     |
| width      | Width of rows         | `number \| string \| (number \| string)[]` | -       |

### Skeleton.Tags

| Property | Description                    | Type                                       | Default                                       |
| -------- | ------------------------------ | ------------------------------------------ | --------------------------------------------- |
| active   | Show animation effect          | `boolean`                                  | `true`                                        |
| count    | Number of placeholder tags     | `number`                                   | `3`                                           |
| gap      | Spacing between tags           | `number`                                   | `theme.paddingXS`                             |
| height   | Tag height (can override size) | `number \| string`                         | `size` map (small: 20, middle: 22, large: 28) |
| size     | Tag size                       | `'small' \| 'middle' \| 'large'`           | `'middle'`                                    |
| width    | Width(s) for each tag          | `number \| string \| (number \| string)[]` | `size` map (small: 56, middle: 68, large: 88) |
