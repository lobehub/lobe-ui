---
nav: Mdx
group: Built-ins
title: Steps
description: A component for displaying ordered steps or instructions in MDX documents. Steps are automatically styled with numbering for a clear sequential flow.
atomId: Steps
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Steps/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Steps/index.tsx'
---

## Example

<code src="./demos/index.tsx" ></code>

## APIs

| Property  | Description                                                 | Type            | Default |
| --------- | ----------------------------------------------------------- | --------------- | ------- |
| children  | The content of the steps (typically markdown ordered lists) | `ReactNode`     | -       |
| className | Additional CSS class                                        | `string`        | -       |
| style     | Additional styles                                           | `CSSProperties` | -       |

_Note: Steps works best with ordered lists `<ol>` in MDX content, styling them with proper numbering and visual hierarchy._
