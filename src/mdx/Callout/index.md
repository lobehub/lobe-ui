---
nav: Mdx
group: Built-ins
title: Callout
description: A styled component to highlight important content in an MDX document with different visual styles based on the content type (info, tip, warning, error, or important).
atomId: Callout
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/docs/mdx/Callout/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Callout/index.tsx'
---

## Example

<code src="./demos/index.tsx" ></code>

## Usage

<code src="./demos/Story.tsx" nopadding></code>

## APIs

| Property  | Description                                   | Type                                                     | Default  |
| --------- | --------------------------------------------- | -------------------------------------------------------- | -------- |
| type      | Type of the callout which affects its styling | `'tip' \| 'error' \| 'important' \| 'info' \| 'warning'` | `'info'` |
| children  | The content to display inside the callout     | `ReactNode`                                              | -        |
| className | Additional CSS class                          | `string`                                                 | -        |
| style     | Additional styles                             | `CSSProperties`                                          | -        |

_Note: The component also accepts all props from Flexbox_
