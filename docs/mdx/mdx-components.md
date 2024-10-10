---
nav: Mdx
group: Components
title: mdxComponents
atomId: mdxComponents
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/docs/mdx/mdx-components.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/mdxComponents.ts'
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
