---
nav: Components
group: Data Entry
title: DownloadButton
description: DownloadButton is a React component used to download content from a Blob URL. It provides a button with a download icon that, when clicked, triggers a download of the specified content. It also displays a tooltip indicating the file type being downloaded.
---

## Default

<code src="./demos/index.tsx" center></code>

## Custom

<code src="./demos/customFile.tsx"></code>

## APIs

### DownloadButton

| Property | Description                          | Type                            | Default    |
| -------- | ------------------------------------ | ------------------------------- | ---------- |
| blobUrl  | Blob URL for the content to download | `string`                        | -          |
| fileName | File name (without extension)        | `string`                        | `download` |
| fileType | File type/extension (e.g., svg, png) | `string`                        | `svg`      |
| glass    | Apply glass effect to button         | `boolean`                       | `true`     |
| icon     | Custom icon (before download)        | `ReactNode`                     | `Download` |
| disabled | Disable the download button          | `boolean`                       | `false`    |
| active   | Active state of the button           | `boolean`                       | `false`    |
| size     | Size of the button                   | `ActionIconSize`                | `normal`   |
| onClick  | Callback function on click           | `(e: React.MouseEvent) => void` | -          |

Additionally, DownloadButton inherits all properties from [ActionIcon](/components/action-icon) component except for
those specified above. When clicked, it automatically changes the icon to a checkmark for 2 seconds to indicate
successful download initiation.
