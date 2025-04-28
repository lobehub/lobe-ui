---
nav: Components
group: Data Display
title: Image
description: Image is an enhanced image component with preview capabilities, custom actions, and various display styles. It extends Ant Design's Image component with additional features like size control, loading state, and custom toolbar addons.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Gallery

<code src="./demos/Gallery.tsx" center></code>

## Fallback

<code src="./demos/Fallback.tsx" center></code>

## Custom Actions

<code src="./demos/CustomActions.tsx" center></code>

## APIs

### Image

| Property          | Description                                  | Type                                                  | Default |
| ----------------- | -------------------------------------------- | ----------------------------------------------------- | ------- |
| src               | Image source                                 | `string`                                              | -       |
| alt               | Image alt text                               | `string`                                              | -       |
| variant           | Visual style variant                         | `'borderless' \| 'filled' \| 'outlined'`              | -       |
| preview           | Whether to enable preview or preview options | `boolean \| ImagePreviewOptions`                      | `true`  |
| size              | Size of the image container                  | `number \| string`                                    | -       |
| maxWidth          | Maximum width of image container             | `number \| string`                                    | -       |
| minWidth          | Minimum width of image container             | `number \| string`                                    | -       |
| maxHeight         | Maximum height of image container            | `number \| string`                                    | -       |
| minHeight         | Minimum height of image container            | `number \| string`                                    | -       |
| objectFit         | Object-fit style for the image               | `'cover' \| 'contain'`                                | -       |
| isLoading         | Whether the image is in loading state        | `boolean`                                             | `false` |
| actions           | Custom actions to display                    | `ReactNode`                                           | -       |
| alwaysShowActions | Whether to always show action buttons        | `boolean`                                             | `false` |
| toolbarAddon      | Additional content for the preview toolbar   | `ReactNode`                                           | -       |
| classNames        | Custom class names                           | `{ image?: string; wrapper?: string; }`               | -       |
| styles            | Custom styles                                | `{ image?: CSSProperties; wrapper?: CSSProperties; }` | -       |

> Additional props are inherited from Ant Design's [Image](https://ant.design/components/image/) component.

### PreviewGroup

| Property | Description                                  | Type                         | Default |
| -------- | -------------------------------------------- | ---------------------------- | ------- |
| enable   | Whether to enable the preview group          | `boolean`                    | `true`  |
| items    | List of image URLs to include in the preview | `string[]`                   | -       |
| preview  | Preview options                              | `PreviewGroupPreviewOptions` | -       |

### ImagePreviewOptions

| Property     | Description                                | Type        | Default |
| ------------ | ------------------------------------------ | ----------- | ------- |
| toolbarAddon | Additional content for the preview toolbar | `ReactNode` | -       |

> Additional options are inherited from rc-image's ImagePreviewType.
