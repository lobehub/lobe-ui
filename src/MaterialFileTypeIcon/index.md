---
nav: Components
title: MaterialFileTypeIcon
group: Data Display
description: MaterialFileTypeIcon displays file and folder icons in Material Design style based on file extensions or folder names. It supports various file types and provides different visual variants.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property            | Description                                              | Type                          | Default |
| ------------------- | -------------------------------------------------------- | ----------------------------- | ------- |
| filename            | The name of the file or folder                           | `string`                      | -       |
| type                | The type of the item to display                          | `'file' \| 'folder'`          | -       |
| size                | Size of the icon in pixels                               | `number`                      | `48`    |
| variant             | Display style of the icon                                | `'raw' \| 'file' \| 'folder'` | `'raw'` |
| open                | Whether the folder is open (only applies to folder type) | `boolean`                     | -       |
| fallbackUnknownType | Whether to show a fallback icon for unknown file types   | `boolean`                     | `true`  |
