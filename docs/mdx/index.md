---
nav: Mdx
group: Components
title: mdxComponents
atomId: mdxComponents
apiHeader:
  pkg: '@unitalkai/ui/mdx'
  docUrl: 'https://github.com/unitalkai/lobe-ui/tree/master/docs/mdx/index.md'
  sourceUrl: 'https://github.com/unitalkai/lobe-ui/tree/master/src/mdx/mdxComponents.ts'
---

## Usage

```ts
import { mdxComponents } from '@unitalkai/ui/mdx';
import { RemoteContent } from 'nextra/components';

const RemoteMDX = (props: any) => (
  <RemoteContent components={mdxComponents} {...props} />
);

export default RemoteMDX;
```
