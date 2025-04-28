---
nav: Mdx
group: Built-ins
title: FileTree
description: A component for displaying file and folder structures in MDX documents.
atomId: 'File, FileTree, Folder'
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/FileTree/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/FileTree/index.tsx'
---

## Example

<code src="./demos/index.tsx" ></code>

## APIs

### FileTree

| Property  | Description                           | Type            | Default |
| --------- | ------------------------------------- | --------------- | ------- |
| children  | File and Folder components to display | `ReactNode`     | -       |
| className | Additional CSS class                  | `string`        | -       |
| style     | Additional styles                     | `CSSProperties` | -       |

### File

| Property  | Description            | Type                | Default    |
| --------- | ---------------------- | ------------------- | ---------- |
| name      | Name of the file       | `string`            | -          |
| icon      | Custom icon to display | `IconProps['icon']` | `FileIcon` |
| className | Additional CSS class   | `string`            | -          |
| style     | Additional styles      | `CSSProperties`     | -          |

### Folder

| Property    | Description                          | Type                | Default      |
| ----------- | ------------------------------------ | ------------------- | ------------ |
| name        | Name of the folder                   | `string`            | -            |
| defaultOpen | Whether the folder is open initially | `boolean`           | `false`      |
| icon        | Custom icon to display               | `IconProps['icon']` | `FolderIcon` |
| children    | Nested files and folders             | `ReactNode`         | -            |
| className   | Additional CSS class                 | `string`            | -            |
| style       | Additional styles                    | `CSSProperties`     | -            |
