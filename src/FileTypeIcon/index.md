---
nav: Components
title: FileTypeIcon
group: Data Display
description: FileTypeIcon is a component that displays icons based on file types. It supports different file and folder types, color schemes, custom icons, and sizing options for visual representation of files and folders.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Custom Icon

<code src="./demos/Icon.tsx" center></code>

## APIs

| Property | Description                              | Type                 | Default   |
| -------- | ---------------------------------------- | -------------------- | --------- |
| filetype | The type of file to display an icon for  | `string`             | -         |
| type     | Whether to display a file or folder icon | `'file' \| 'folder'` | `'file'`  |
| variant  | Color variant of the icon                | `'color' \| 'mono'`  | `'color'` |
| color    | Custom color for the icon                | `string`             | -         |
| size     | Size of the icon in pixels               | `number`             | `16`      |
| icon     | Custom icon to display                   | `ReactNode`          | -         |
