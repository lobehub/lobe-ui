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

| Property | Description                          | Type     | Default    |
| -------- | ------------------------------------ | -------- | ---------- |
| blobUrl  | Blob URL for the content to download | `string` | -          |
| fileName | File name                            | `string` | `download` |
| fileType | File type/extension (e.g., svg, png) | `string` | `svg`      |

Additionally, DownloadButton inherits all properties from [ActionIcon](/components/action-icon) component except for
those specified above. When clicked, it automatically changes the icon to a checkmark for 2 seconds to indicate
successful download initiation.
