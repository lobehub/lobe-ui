---
nav: Awesome
group: Data Display
title: Features
description: Features is a component for displaying a grid of feature items with icons, descriptions, and optional images.
apiHeader:
  pkg: '@lobehub/ui/awesome'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/Features/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/Features/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Features

| Property      | Description                       | Type                | Default |
| ------------- | --------------------------------- | ------------------- | ------- |
| items         | Array of feature items to display | `FeatureItemType[]` | -       |
| columns       | Number of columns in the grid     | `number`            | -       |
| gap           | Gap between grid items            | `number \| string`  | -       |
| maxWidth      | Maximum width of the content      | `number`            | -       |
| itemClassName | Class name for each feature item  | `string`            | -       |
| itemStyle     | Style for each feature item       | `CSSProperties`     | -       |

### FeatureItemType

| Property     | Description                             | Type                             | Default |
| ------------ | --------------------------------------- | -------------------------------- | ------- |
| title        | Title of the feature                    | `string`                         | -       |
| description  | Description of the feature              | `string`                         | -       |
| icon         | Icon for the feature                    | `IconProps['icon']`              | -       |
| image        | URL of the image                        | `string`                         | -       |
| imageType    | Type of image styling                   | `'light' \| 'primary' \| 'soon'` | -       |
| imageStyle   | Custom style for the image              | `CSSProperties`                  | -       |
| link         | URL to navigate to when clicked         | `string`                         | -       |
| openExternal | Whether to open link in new tab         | `boolean`                        | -       |
| hero         | Whether this is a hero feature (larger) | `boolean`                        | -       |
| column       | Custom column span                      | `number`                         | -       |
| row          | Custom row span                         | `number`                         | -       |
