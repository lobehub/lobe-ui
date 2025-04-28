---
nav: Components
group: Data Display
title: Snippet
description: The Snippet component is used to display a code snippet with syntax highlighting. It can be customized with a symbol before the content and a language for syntax highlighting. The component is also copyable with a CopyButton included by default.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property  | Description                          | Type                                     | Default    |
| --------- | ------------------------------------ | ---------------------------------------- | ---------- |
| children  | Content of the snippet               | `string`                                 | -          |
| language  | Language for syntax highlighting     | `string`                                 | `'tsx'`    |
| prefix    | Symbol to display before the content | `string`                                 | -          |
| copyable  | Whether to show copy button          | `boolean`                                | `true`     |
| variant   | Style variant of the snippet         | `'filled' \| 'outlined' \| 'borderless'` | `'filled'` |
| shadow    | Whether to show shadow effect        | `boolean`                                | `false`    |
| spotlight | Whether to show spotlight effect     | `boolean`                                | -          |
