---
nav: Mdx
group: Built-ins
title: Tabs
atomId: 'Tabs, Tab'
description: A component for creating tabbed content in MDX documents that allows switching between different content sections.
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Tabs/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Tabs/index.tsx'
---

## Example

<code src="./demos/index.tsx" ></code>

## APIs

### Tabs

| Property     | Description                                     | Type                     | Default |
| ------------ | ----------------------------------------------- | ------------------------ | ------- |
| items        | Array of tab labels                             | `string[]`               | -       |
| children     | Array of Tab components or content for each tab | `ReactNode[]`            | -       |
| defaultIndex | The initially active tab                        | `number \| string`       | `'0'`   |
| tabNavProps  | Additional props for the tab navigation bar     | `Partial<LobeTabsProps>` | `{}`    |
| className    | Additional CSS class                            | `string`                 | -       |
| style        | Additional styles                               | `CSSProperties`          | -       |

### Tab

| Property  | Description          | Type            | Default |
| --------- | -------------------- | --------------- | ------- |
| children  | Content of the tab   | `ReactNode`     | -       |
| className | Additional CSS class | `string`        | -       |
| style     | Additional styles    | `CSSProperties` | -       |
