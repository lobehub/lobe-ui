---
nav: Mdx
group: Components
title: mdxComponents
atomId: mdxComponents
description: A collection of enhanced React components for rendering MDX content with improved styling and functionality.
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/mdx-components/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/mdxComponents/index.ts'
---

## Usage

```ts
import { mdxComponents } from '@lobehub/ui/mdx';
import { RemoteContent } from 'nextra/components';

const RemoteMDX = (props: any) => (
  <RemoteContent components={mdxComponents} {...props} />
);

export default RemoteMDX;
```

## APIs

### Components Included

| Component | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| Callout   | Styled alert boxes for highlighted content                            |
| Card      | Individual card component with title, description, and optional image |
| Cards     | Container for multiple Card components                                |
| FileTree  | Component for displaying file and folder structures                   |
| Image     | Enhanced image component with preview capability                      |
| Steps     | Component for displaying ordered steps                                |
| Tab       | Individual tab content container                                      |
| Tabs      | Container for tabbed content                                          |
| Video     | Video component for MDX                                               |
| Link (a)  | Enhanced link component with styling and external link handling       |

These components can be used directly in MDX content or passed to an MDX renderer's components prop to enhance the rendering of MDX content.
