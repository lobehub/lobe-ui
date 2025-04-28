---
nav: Components
group: Data Display
title: Video
description: Video component for displaying video content with customizable controls, preview mode, and various styles. It supports standard HTML video features while providing an enhanced user interface.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property   | Description                              | Type                                                                       | Default    |
| ---------- | ---------------------------------------- | -------------------------------------------------------------------------- | ---------- |
| src        | Video source URL                         | `string`                                                                   | -          |
| preview    | Whether to show preview with play button | `boolean`                                                                  | `true`     |
| autoPlay   | Whether to auto play the video           | `boolean`                                                                  | -          |
| variant    | Style variant of the video container     | `'borderless' \| 'filled' \| 'outlined'`                                   | `'filled'` |
| poster     | Preview image before video plays         | `string`                                                                   | -          |
| loop       | Whether to loop the video                | `boolean`                                                                  | -          |
| muted      | Whether the video is muted               | `boolean`                                                                  | -          |
| preload    | How the video should be loaded           | `'none' \| 'metadata' \| 'auto'`                                           | `'auto'`   |
| isLoading  | Whether the video is in loading state    | `boolean`                                                                  | -          |
| width      | Width of the video                       | `number \| string`                                                         | -          |
| height     | Height of the video                      | `number \| string`                                                         | -          |
| maxWidth   | Maximum width of the video               | `number \| string`                                                         | `'100%'`   |
| maxHeight  | Maximum height of the video              | `number \| string`                                                         | `'100%'`   |
| minWidth   | Minimum width of the video               | `number \| string`                                                         | -          |
| minHeight  | Minimum height of the video              | `number \| string`                                                         | -          |
| onPlay     | Callback when video starts playing       | `(e: React.SyntheticEvent<HTMLVideoElement>) => void`                      | -          |
| onPause    | Callback when video is paused            | `(e: React.SyntheticEvent<HTMLVideoElement>) => void`                      | -          |
| onEnded    | Callback when video ends                 | `(e: React.SyntheticEvent<HTMLVideoElement>) => void`                      | -          |
| styles     | Custom styles for components             | `{ wrapper?: CSSProperties; video?: CSSProperties; mask?: CSSProperties }` | -          |
| classNames | Custom class names for components        | `{ wrapper?: string; video?: string; mask?: string }`                      | -          |
